import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="relative container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-8 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Your Path to SAT Success <span className="block text-[#5800FF] dark:text-[#7C3AED] mt-2">Starts Here</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-[#5800FF] hover:bg-[#4600CC] dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9] text-white px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/practice">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                Practice
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

