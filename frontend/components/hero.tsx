'use client';
import { GodRays } from "@paper-design/shaders-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignupModal from "@/components/login";

export default function Hero() {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

	const handleExpand = () => {
		setIsExpanded(true);
	};

	const handleClose = () => {
		setIsExpanded(false);
	};

	const handleSignInClick = () => {
		router.push('/login');
	};

	useEffect(() => {
		if (isExpanded) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [isExpanded]);

    return (
        <>
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
            <div className="absolute inset-0">
					<GodRays
						colorBack="#00000000"
						colors={['#FFFFFF6E', '#F3F3F3F0', '#8A8A8A', '#989898']}
						colorBloom="#FFFFFF"
						offsetX={0.85}
						offsetY={-1}
						intensity={1}
						spotty={0.45}
						midSize={10}
						midIntensity={0}
						density={0.12}
						bloom={0.15}
						speed={1}
						scale={1.6}
						frame={3332042.8159981333}
						style={{
							height: '100%',
							width: '100%',
							position: 'absolute',
							top: 0,
							left: 0,
						}}
					/>
				</div>

				<div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 text-center">
					<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[90%] tracking-[-0.03em] text-black mix-blend-exclusion max-w-2xl">
						Create your account
					</h1>

					<p className="text-base sm:text-lg md:text-xl leading-[160%] text-black max-w-2xl px-4">
						Get started today. Access your dashboard and manage your profile and
						settings with confidence.
					</p>

					<AnimatePresence initial={false}>
						{!isExpanded && (
							<motion.div className="inline-block relative">
								<motion.div
									style={{
										borderRadius: '100px',
									}}
									layout
									layoutId="cta-card"
									className="absolute inset-0 bg-[#004FE5] items-center justify-center transform-gpu will-change-transform"
								></motion.div>
								<motion.button
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.2 }}
									exit={{ opacity: 0, scale: 0.8 }}
									layout={false}
									onClick={handleExpand}
									className="h-15 px-6 sm:px-8 py-3 text-lg sm:text-xl font-regular text-[#E3E3E3] tracking-[-0.01em] relative"
								>
									Get started today
								</motion.button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
        </div>
        <SignupModal isExpanded={isExpanded} onClose={handleClose} onSignInClick={handleSignInClick} />
        </>
    )
}

