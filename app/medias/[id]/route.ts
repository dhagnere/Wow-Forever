import { servirImage } from "@/lib/medias";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return servirImage((await params).id, "une");
}
