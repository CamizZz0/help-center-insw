import { Link } from "react-router-dom";

export default function Breadcrumb({ categoryName }) {
    return (
        <div className="bg-[#F3F3F3]">
            <nav className="mx-auto flex min-h-[81px] max-w-[1458px] items-center gap-2 px-6 text-[13px] 2xl:px-0">
                <Link
                    to="/"
                    className="text-[#0066FF] hover:underline"
                >
                    Beranda
                </Link>

                <span className="text-[#666666]">›</span>

                {categoryName ? (
                    <>
                        <Link
                            to="/"
                            className="text-[#0066FF] hover:underline"
                        >
                            Pusat Bantuan
                        </Link>

                        <span className="text-[#666666]">›</span>

                        <span className="font-semibold text-black">
                            {categoryName}
                        </span>
                    </>
                ) : (
                    <span className="font-semibold text-black">
                        Pusat Bantuan
                    </span>
                )}
            </nav>
        </div>
    );
}