import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { slugify } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AdminHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl text-primary">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/** Horizontally scrollable table shell. */
export function AdminTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-secondary text-left text-secondary-foreground">
          <tr>{head.map((h) => <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}

export function TableSkeleton() {
  return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>;
}

export function EmptyRow({ cols, text = "Nothing to show." }: { cols: number; text?: string }) {
  return <tr><td colSpan={cols} className="px-3 py-10 text-center text-muted-foreground">{text}</td></tr>;
}

export function ConfirmButton({ label, title, description, onConfirm, children }: { label: string; title: string; description: string; onConfirm: () => void; children?: ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children ?? <Button size="icon" variant="ghost" aria-label={label}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>{title}</AlertDialogTitle><AlertDialogDescription>{description}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const selectCls = "h-9 rounded-md border border-input bg-card px-2 text-sm";

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "switch" | "image" | "list" | "slug";
  required?: boolean;
  full?: boolean;
};

type Row = { id: string } & Record<string, unknown>;

/** Generic list + add/edit dialog + delete confirmation. */
export function CrudPage<T extends { id: string }>(props: {
  title: string;
  queryKey: string;
  fetch: () => Promise<T[]>;
  save: (row: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
  fields: Field[];
  slugFrom: string;
  blank: Partial<T>;
  columns: { label: string; render: (row: T) => ReactNode }[];
  searchText: (row: T) => string;
  rowClass?: (row: T) => string;
}) {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["admin", props.queryKey], queryFn: props.fetch });
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const saveM = useMutation({
    mutationFn: (r: Row) => props.save(r as unknown as Partial<T>),
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin", props.queryKey] }); },
    onError: (e) => toast.error((e as Error).message),
  });
  const delM = useMutation({
    mutationFn: props.remove,
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", props.queryKey] }); },
    onError: (e) => toast.error((e as Error).message),
  });

  const open = (row?: T) => { setErrors({}); setSlugTouched(!!row); setEditing({ ...(row ?? props.blank) } as unknown as Row); };
  const set = (k: string, v: unknown) => setEditing((e) => {
    if (!e) return e;
    const next = { ...e, [k]: v };
    if (k === props.slugFrom && !slugTouched) next["slug"] = slugify(String(v)).replace(/^-|-$/g, "");
    return next;
  });
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    const er: Record<string, string> = {};
    props.fields.forEach((f) => { if (f.required && (editing[f.key] === "" || editing[f.key] == null)) er[f.key] = "Required"; });
    props.fields.filter((f) => f.type === "number").forEach((f) => { if (Number(editing[f.key]) < 0) er[f.key] = "Must be 0 or more"; });
    setErrors(er);
    if (Object.keys(er).length) return;
    saveM.mutate(editing);
  };

  const list = (data ?? []).filter((r) => props.searchText(r).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <AdminHeader title={props.title}>
        <Input aria-label="Search" placeholder="Search…" className="w-48" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={() => open()}><Plus className="h-4 w-4" />Add</Button>
      </AdminHeader>
      {isError ? <div className="rounded-xl border p-6 text-center">Couldn't load. <Button variant="link" onClick={() => refetch()}>Retry</Button></div>
        : isLoading ? <TableSkeleton />
        : (
          <AdminTable head={[...props.columns.map((c) => c.label), ""]}>
            {!list.length ? <EmptyRow cols={props.columns.length + 1} /> : list.map((r) => (
              <tr key={r.id} className={cn("hover:bg-muted/50", props.rowClass?.(r))}>
                {props.columns.map((c) => <td key={c.label} className="px-3 py-2 align-middle">{c.render(r)}</td>)}
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => open(r)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmButton label="Delete" title="Delete this item?" description="This cannot be undone." onConfirm={() => delM.mutate(r.id)} />
                </td>
              </tr>
            ))}
          </AdminTable>
        )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} {props.title.replace(/s$/, "")}</DialogTitle></DialogHeader>
          {editing && (
            <form id="crud-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
              {props.fields.map((f) => (
                <FieldInput key={f.key} f={f} value={editing[f.key]} error={errors[f.key]}
                  onChange={(v) => { if (f.key === "slug") setSlugTouched(true); set(f.key, v); }} />
              ))}
            </form>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" form="crud-form" disabled={saveM.isPending}>{saveM.isPending ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FieldInput({ f, value, onChange, error }: { f: Field; value: unknown; onChange: (v: unknown) => void; error?: string | undefined }) {
  const id = `f-${f.key}`;
  const wrap = (el: ReactNode) => (
    <div className={cn((f.full || f.type === "textarea" || f.type === "list" || f.type === "image") && "sm:col-span-2")}>
      <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
      <div className="mt-1">{el}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
  switch (f.type) {
    case "switch":
      return <div className="flex items-center gap-3 sm:col-span-2"><Switch id={id} checked={!!value} onCheckedChange={onChange} /><Label htmlFor={id}>{f.label}</Label></div>;
    case "textarea":
      return wrap(<Textarea id={id} rows={4} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />);
    case "list":
      return wrap(<Textarea id={id} rows={3} placeholder="One per line" value={((value as string[]) ?? []).join("\n")} onChange={(e) => onChange(e.target.value.split("\n"))} />);
    case "number":
      return wrap(<Input id={id} type="number" min={0} value={String(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} aria-invalid={!!error} />);
    case "date":
      return wrap(<Input id={id} type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />);
    case "image":
      return wrap(
        <div className="flex flex-wrap items-start gap-3">
          {value ? <img src={String(value)} alt="Preview" className="h-24 w-32 rounded-lg border object-cover" /> : <div className="grid h-24 w-32 place-items-center rounded-lg border border-dashed text-xs text-muted-foreground">No image</div>}
          <div className="flex-1 space-y-2">
            <Input id={id} type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const r = new FileReader();
              r.onload = () => onChange(r.result);
              r.readAsDataURL(file);
            }} />
            <Input aria-label="Image URL" placeholder="…or paste an image URL" value={String(value ?? "").startsWith("data:") ? "" : String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          </div>
        </div>,
      );
    default:
      return wrap(<Input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />);
  }
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
