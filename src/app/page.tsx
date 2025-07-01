import { CalculatorForm } from "@/components/calculator-form";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo className="h-16 w-16 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
            3D Print Price Pal
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Your friendly assistant for calculating 3D printing costs with precision. Upload your G-code for an instant analysis.
          </p>
        </header>
        <CalculatorForm />
      </div>
    </main>
  );
}
