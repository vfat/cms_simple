import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { paths?: string[] };
    const pathsToRevalidate = body.paths ?? ["/", "/blog", "/catalog"];

    for (const p of pathsToRevalidate) {
      revalidatePath(p);
    }

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        revalidated: false,
        message: error instanceof Error ? error.message : "Revalidation error",
      },
      { status: 500 }
    );
  }
}
