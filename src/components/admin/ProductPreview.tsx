import { useState } from "react";
import { imageUrl } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Eye, LayoutGrid, FileText, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export interface ProductPreviewData {
  name: string;
  description: string;
  tech_info: string;
  images: string[];
  categoryName?: string;
  category_id?: string;
  active: boolean;
  sort_order: number;
}

interface CategoryOption {
  id: string;
  name: string;
  mega_column?: string | null;
}

interface ProductPreviewProps {
  data: ProductPreviewData;
  className?: string;
  defaultMode?: "catalog" | "detail";
  showModeToggle?: boolean;
  compact?: boolean;
  editable?: boolean;
  categories?: CategoryOption[];
  onFieldChange?: (field: "name" | "description" | "tech_info" | "category_id", value: string) => void;
}

const editableFieldClass =
  "w-full rounded-md border border-transparent bg-transparent px-2 py-1 -mx-2 transition-[border-color,background-color,box-shadow] hover:border-border/60 hover:bg-muted/30 focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/30";

const ProductPreview = ({
  data,
  className,
  defaultMode = "catalog",
  showModeToggle = true,
  compact = false,
  editable = false,
  categories = [],
  onFieldChange,
}: ProductPreviewProps) => {
  const [mode, setMode] = useState<"catalog" | "detail">(defaultMode);
  const [selectedImage, setSelectedImage] = useState(0);

  const displayName = data.name.trim() || "Nome do produto";
  const hasImages = data.images.length > 0;
  const detailMode = editable ? "detail" : mode;

  const categoryField = (() => {
    if (editable && categories.length > 0) {
      return (
        <div className="mb-2">
          <Label htmlFor="preview-category" className="sr-only">
            Categoria
          </Label>
          <select
            id="preview-category"
            value={data.category_id ?? ""}
            onChange={(e) => onFieldChange?.("category_id", e.target.value)}
            className={cn(
              editableFieldClass,
              "text-[10px] font-semibold uppercase tracking-[0.15em] text-primary cursor-pointer"
            )}
          >
            <option value="">Selecione a categoria…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.mega_column ? ` (${c.mega_column})` : ""}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (data.categoryName) {
      return (
        <p className="mb-1.5 truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
          {data.categoryName}
        </p>
      );
    }

    return null;
  })();

  const renderNameField = (nameClass?: string) => {
    if (editable) {
      return (
        <div>
          <Label htmlFor="preview-name" className="sr-only">
            Nome do produto
          </Label>
          <Input
            id="preview-name"
            name="name"
            value={data.name}
            onChange={(e) => onFieldChange?.("name", e.target.value)}
            placeholder="Nome do produto…"
            className={cn(
              editableFieldClass,
              "font-heading font-bold leading-tight h-auto",
              nameClass
            )}
          />
        </div>
      );
    }

    return (
      <h2 className={cn("font-heading font-bold leading-tight text-balance", nameClass)}>
        {displayName}
      </h2>
    );
  };

  const renderDescriptionField = (rows = 4) => {
    if (editable) {
      return (
        <div>
          <Label htmlFor="preview-description" className="mb-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <Pencil size={10} aria-hidden="true" />
            Descrição
          </Label>
          <Textarea
            id="preview-description"
            name="description"
            rows={rows}
            value={data.description}
            onChange={(e) => onFieldChange?.("description", e.target.value)}
            placeholder="Descreva o produto para o visitante…"
            className={cn(editableFieldClass, "min-h-[80px] resize-y text-xs leading-relaxed")}
          />
        </div>
      );
    }

    if (data.description) {
      return (
        <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground text-pretty break-words">
          {data.description}
        </p>
      );
    }

    return <p className="text-xs italic text-muted-foreground/60">Descrição do produto</p>;
  };

  const techInfoField = (() => {
    if (editable) {
      return (
        <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-3">
          <Label htmlFor="preview-tech" className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
            <Pencil size={10} aria-hidden="true" />
            Informações técnicas
          </Label>
          <Textarea
            id="preview-tech"
            name="tech_info"
            rows={4}
            value={data.tech_info}
            onChange={(e) => onFieldChange?.("tech_info", e.target.value)}
            placeholder="Dimensões, materiais, normas NBR…"
            className={cn(editableFieldClass, "min-h-[72px] resize-y text-xs leading-relaxed")}
          />
        </div>
      );
    }

    if (data.tech_info) {
      return (
        <div className="rounded-lg bg-muted/60 p-3">
          <h4 className="mb-1 font-heading text-[10px] font-bold uppercase tracking-wider">
            Informações técnicas
          </h4>
          <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground text-pretty break-words">
            {data.tech_info}
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-dashed border-border/80 p-3 text-xs italic text-muted-foreground/60">
        Informações técnicas
      </div>
    );
  })();

  return (
    <div className={cn("flex flex-col", className)}>
      {showModeToggle && !editable && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Eye size={14} aria-hidden="true" />
            Pré-visualização
          </div>
          <div
            className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5"
            role="tablist"
            aria-label="Modo de pré-visualização"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "catalog"}
              aria-label="Visualizar como catálogo"
              onClick={() => setMode("catalog")}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "motion-safe:transition-[color,background-color,box-shadow] motion-safe:duration-200",
                mode === "catalog"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid size={12} aria-hidden="true" />
              Catálogo
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "detail"}
              aria-label="Visualizar como página"
              onClick={() => setMode("detail")}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "motion-safe:transition-[color,background-color,box-shadow] motion-safe:duration-200",
                mode === "detail"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText size={12} aria-hidden="true" />
              Página
            </button>
          </div>
        </div>
      )}

      {editable && (
        <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-primary">
          <Pencil size={14} aria-hidden="true" />
          Clique nos textos abaixo para editar
        </div>
      )}

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-card shadow-sm",
          !data.active && "opacity-75",
          editable && "ring-1 ring-primary/10"
        )}
      >
        {!data.active && (
          <div className="absolute top-3 right-3 z-10 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Rascunho
          </div>
        )}

        {detailMode === "catalog" && !editable ? (
          <div className={cn(compact && "motion-safe:scale-[0.98] motion-safe:origin-top")}>
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/40">
              {hasImages ? (
                <img
                  src={imageUrl(data.images[0])}
                  alt={displayName}
                  width={320}
                  height={320}
                  loading="lazy"
                  className="h-full w-full object-contain p-4 motion-safe:transition-transform motion-safe:duration-500"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <div
                    className="h-16 w-16 rounded-lg border-2 border-dashed border-border/80"
                    aria-hidden="true"
                  />
                  <span className="text-xs">Sem imagem de capa</span>
                </div>
              )}
            </div>
            <div className="border-t border-border/60 p-4">
              {categoryField}
              {renderNameField("mb-1.5 text-base font-semibold")}
              <div className="mt-1.5">
                {renderDescriptionField(3)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="rounded bg-muted px-1.5 py-0.5 tabular-nums">
                  Posição {data.sort_order}
                </span>
                {hasImages && data.images.length > 1 && (
                  <span className="tabular-nums">{data.images.length} fotos</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={cn("p-4", compact && "text-sm")}>
            <div className="grid gap-4">
              <div>
                <div className="aspect-square overflow-hidden rounded-lg border border-border/60 bg-muted">
                  {hasImages ? (
                    <img
                      src={imageUrl(data.images[selectedImage] ?? data.images[0])}
                      alt={displayName}
                      width={320}
                      height={320}
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
                {data.images.length > 1 && (
                  <div className="mt-2 grid grid-cols-5 gap-1.5" role="list" aria-label="Miniaturas">
                    {data.images.map((path, i) => (
                      <button
                        key={path}
                        type="button"
                        role="listitem"
                        aria-label={`Ver imagem ${i + 1}`}
                        aria-current={i === selectedImage ? "true" : undefined}
                        onClick={() => setSelectedImage(i)}
                        className={cn(
                          "aspect-square overflow-hidden rounded border-2",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          "motion-safe:transition-[border-color] motion-safe:duration-200",
                          i === selectedImage
                            ? "border-primary"
                            : "border-transparent hover:border-border"
                        )}
                      >
                        <img
                          src={imageUrl(path)}
                          alt=""
                          width={64}
                          height={64}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-3">
                {categoryField}
                {renderNameField("text-lg")}
                {renderDescriptionField(editable ? 5 : 4)}
                {techInfoField}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPreview;
