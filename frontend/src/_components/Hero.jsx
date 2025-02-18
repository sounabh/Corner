
import {Badge} from "../components/ui/badge.jsx"
import {Button} from "../components/ui/button.jsx"

const Hero = () => {
  return (
    <div>



<section className="container mx-auto px-4 py-24 text-center">
      <Badge
        variant="outline"
        className="mb-4 border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      >
        Beta Access Available
      </Badge>
      <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
        Code Smarter with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          AI-Powered
        </span>{" "}
        Intelligence
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-zinc-400 md:text-lg">
        Experience the future of coding with our real-time collaborative editor enhanced by advanced AI capabilities.
        Write, debug, and deploy faster than ever before.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
          Start Coding Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-zinc-700 hover:bg-zinc-800"
        >
          Watch Demo
        </Button>
      </div>
    </section>
      
    </div>
  )
}

export default Hero
