import { IoArrowBackSharp } from "react-icons/io5";
import Link from "next/link";

export default function Voltar() {
    return (
        <Link href="/home">
            <div className="bg-[var(--midnight-black)] flex items-center gap-1 text-[var(--electric-sky)]  px-4 py-2 border-2 border-[var(--border-primary)] rounded hover:bg-[var(--hover-glow)] hover:border-[var(--medium-glow)] transition-colors cursor-pointer">
                <IoArrowBackSharp className="inline-block mr-2" size={14} />
                <p className="font-semibold text-[14px] hover:text-[var(--soft-cyan)] transition-colors">
                    Voltar
                </p>
            </div>
        </Link>
    );
}