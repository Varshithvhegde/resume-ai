import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { docs_v1 } from "googleapis"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ExtractedBlock = {
  text: string
  startIndex: number
  endIndex: number
}

export function extractTextFromGoogleDoc(
  body: docs_v1.Schema$StructuralElement[] = []
): ExtractedBlock[] {
  const blocks: ExtractedBlock[] = []

  for (const block of body) {
    // === Paragraphs ===
    if (block.paragraph) {
      for (const element of block.paragraph.elements || []) {
        const text = element.textRun?.content?.trim()
        const startIndex = element.startIndex ?? -1
        const endIndex = element.endIndex ?? -1

        if (
          text &&
          startIndex !== -1 &&
          endIndex !== -1 &&
          startIndex < endIndex
        ) {
          blocks.push({
            text,
            startIndex,
            endIndex,
          })
        }
      }
    }

    // === Tables ===
    else if (block.table) {
      for (const [rowIndex, row] of (block.table.tableRows || []).entries()) {
        for (const [cellIndex, cell] of (row.tableCells || []).entries()) {
          for (const cellBlock of cell.content || []) {
            if (cellBlock.paragraph) {
              for (const element of cellBlock.paragraph.elements || []) {
                const text = element.textRun?.content?.trim()
                const startIndex = element.startIndex ?? -1
                const endIndex = element.endIndex ?? -1

                if (
                  text &&
                  startIndex !== -1 &&
                  endIndex !== -1 &&
                  startIndex < endIndex
                ) {
                  blocks.push({
                    text: `Cell [${rowIndex}, ${cellIndex}]: ${text}`,
                    startIndex,
                    endIndex,
                  })
                }
              }
            }
          }
        }
      }
    }

    // === Bullets ===
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    else if (block.bullet && block.paragraph) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      for (const element of block.paragraph.elements || []) {
        const text = element.textRun?.content?.trim()
        const startIndex = element.startIndex ?? -1
        const endIndex = element.endIndex ?? -1

        if (
          text &&
          startIndex !== -1 &&
          endIndex !== -1 &&
          startIndex < endIndex
        ) {
          blocks.push({
            text: `• ${text}`,
            startIndex,
            endIndex,
          })
        }
      }
    }
  }

  return blocks
}
