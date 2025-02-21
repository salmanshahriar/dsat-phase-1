import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Image from "next/image"

export function ReferenceModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 px-2 sm:px-3 bg-primary/10 rounded-md">
          <BookOpen className="h-4 w-4" />
          <span className="sr-only">Open reference sheet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" aria-describedby="reference-sheet-description">
        <DialogHeader>
          <DialogTitle>Reference Sheet</DialogTitle>
          <DialogDescription id="reference-sheet-description">
            Common mathematical formulas and geometric shapes used in SAT Math problems.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-13%20at%205.20.52%E2%80%AFPM-ZATHi7edcdcdHDfmbiewqXNVttN6m5.png"
            alt="Mathematical formulas and geometric shapes reference sheet"
            fill
            className="object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

