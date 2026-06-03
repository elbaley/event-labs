import Image from "next/image";
import { EventSearchCombobox } from "@/components/events/event-search-combobox";

export function HomeHero() {
  return (
    <section className="grid min-h-90 overflow-hidden rounded-md border bg-linear-to-r from-[#1147c7] to-[#0b1f5b] text-white md:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10">
        <div className="space-y-4">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-normal sm:text-5xl">
            Türkiye&apos;deki etkinlikleri keşfet.
          </h1>
          <p className="max-w-xl text-base leading-7 text-white/85">
            Konser, tiyatro ve spor etkinliklerini tek yerden incele. Favori
            şehirlerindeki öne çıkan programlara hızlıca göz at.
          </p>
        </div>

        <EventSearchCombobox className="h-12 w-full max-w-xl border-white bg-white! text-foreground shadow-none [&_button_svg]:text-muted-foreground [&_input]:font-medium [&_input]:text-foreground [&_input::placeholder]:text-muted-foreground" />
      </div>

      <div className="relative min-h-64 border-t border-white/15 md:border-t-0 md:border-l">
        <Image
          src="https://images.unsplash.com/photo-1522158637959-30385a09e0da?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Event Lab sahne atmosferi"
          fill
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover brightness-90"
        />
      </div>
    </section>
  );
}
