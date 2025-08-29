import Link from "next/link";
import Image from "next/image";

export default function CTA(){
    return(
        <section className="px-4 md:px-16 py-16 md:py-28">
            <div className="max-w-6xl mx-auto">
                <div className="relative rounded-[24px] md:rounded-[40px] overflow-hidden">
                    {/* Background Image */}
                    <Image
                        src="/Img/CTA.avif"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/60"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 px-6 md:px-16 py-12 md:py-16 text-center">
                        <div className="max-w-3xl mx-auto space-y-8">
                            <div className="space-y-6">
                                <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
                                    Ready to Build Something Amazing?
                                </h2>
                                <p className="font-manrope text-lg text-white">
                                    Let's discuss your project and see how we can help you achieve your digital goals. 
                                    Free consultation and honest advice
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href={"/contact"}>
                                    <button className="bg-[#008070] cursor-pointer hover:bg-[#006b5d] text-white px-8 py-4 rounded-lg font-manrope font-semibold w-full sm:w-auto transition-colors">
                                        Start Your Project
                                    </button>
                                </Link>
                                <Link href={"/contact"}>
                                    <button className="border-2 border-white cursor-pointer text-white bg-transparent hover:bg-white hover:text-[#191E1E] px-8 py-4 rounded-lg font-manrope font-semibold w-full sm:w-auto transition-colors">
                                        Schedule a Call
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}