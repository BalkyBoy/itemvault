'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/lib/api';

const inputClassName =
	'w-full px-4 py-2.5 rounded-lg bg-[#001F63] border-0 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-10';

const labelClassName =
	'block text-[10px] font-mono font-normal text-white mb-2 tracking-[0.5px] uppercase';

const errorClassName = 'mt-1.5 text-xs text-red-200';

type FormField = 'email' | 'password';
type FormErrors = Partial<Record<FormField, string>>;

export interface LoginModalProps {
	isExpanded: boolean;
	onClose: () => void;
	onSignUpClick?: () => void;
}

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginModal({
	isExpanded,
	onClose,
	onSignUpClick,
}: LoginModalProps) {
	const router = useRouter();
	const { login } = useAuth();

	const [formData, setFormData] = useState({ email: '', password: '' });
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitError, setSubmitError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setSubmitError('');
		if (errors[name as FormField]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[name as FormField];
				return next;
			});
		}
	};

	const validate = (): FormErrors => {
		const next: FormErrors = {};
		if (!formData.email.trim()) {
			next.email = 'Email is required';
		} else if (!isValidEmail(formData.email)) {
			next.email = 'Enter a valid email address';
		}
		if (!formData.password) {
			next.password = 'Password is required';
		}
		return next;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setErrors({});
		setSubmitError('');
		setIsSubmitting(true);

		try {
			const result = await loginUser(
				formData.email.trim().toLowerCase(),
				formData.password
			);
			login(result.tokens.accessToken, result.tokens.refreshToken, result.user);
			router.push('/dashboard');
		} catch (err) {
			setSubmitError(
				err instanceof Error ? err.message : 'Invalid email or password'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AnimatePresence initial={false}>
			{isExpanded && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-2">
					<motion.div
						layoutId="login-card"
						style={{ borderRadius: '24px' }}
						layout
						className="relative flex h-full w-full overflow-hidden bg-[#004FE5] transform-gpu will-change-transform"
					>
						<div className="h-full w-full overflow-y-auto scrollbar-hide">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="relative py-8 z-10 min-h-full flex flex-col lg:flex-row w-full max-w-[1100px] mx-auto items-center p-6 sm:p-10 lg:p-16 gap-8 lg:gap-16"
							>
								{/* Left — branding */}
								<div className="flex-1 flex flex-col justify-center space-y-3 w-full">
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-none tracking-[-0.03em]">
										Welcome back
									</h2>
									<p className="text-sm sm:text-base text-white/90 leading-[150%] pt-2 max-w-md">
										Sign in to your account to access your dashboard and manage
										your inventory in one place.
									</p>
									<div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/20">
										<p className="text-lg sm:text-xl lg:text-2xl text-white leading-[150%] mb-4">
											Logging back in is seamless — my dashboard was exactly
											where I left it.
										</p>
										<div className="flex items-center gap-3 sm:gap-4">
												<svg
													className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
													viewBox="0 0 40 40"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<circle cx="20" cy="20" r="20" fill="#E3E3E3" />
													<text
														x="20"
														y="26"
														textAnchor="middle"
														fontSize="18"
														fontWeight="600"
														fill="#004FE5"
													>
														SC
													</text>
												</svg>
											<div>
												<p className="text-base sm:text-lg lg:text-xl text-white">
													Sarah Chen
												</p>
												<p className="text-sm sm:text-base text-white/70">
													Member since 2024
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Right — form */}
								<div className="flex-1 w-full">
									<form
										className="space-y-4 sm:space-y-5"
										onSubmit={handleSubmit}
										noValidate
									>
										{submitError && (
											<div className="rounded-lg bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-200">
												{submitError}
											</div>
										)}

										<div>
											<label htmlFor="email" className={labelClassName}>
												EMAIL ADDRESS *
											</label>
											<input
												id="email"
												name="email"
												type="email"
												autoComplete="email"
												value={formData.email}
												onChange={handleChange}
												className={inputClassName}
											/>
											{errors.email && (
												<p className={errorClassName}>{errors.email}</p>
											)}
										</div>

										<div>
											<div className="flex items-center justify-between mb-2">
												<label htmlFor="password" className={labelClassName} style={{ marginBottom: 0 }}>
													PASSWORD *
												</label>
												<button
													type="button"
													className="text-[10px] font-mono text-white/60 hover:text-white tracking-[0.5px] uppercase transition-colors"
												>
													Forgot password?
												</button>
											</div>
											<div className="relative">
												<input
													id="password"
													name="password"
													type={showPassword ? 'text' : 'password'}
													autoComplete="current-password"
													value={formData.password}
													onChange={handleChange}
													className={`${inputClassName} pr-11`}
												/>
												<button
													type="button"
													onClick={() => setShowPassword((p) => !p)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
											{errors.password && (
												<p className={errorClassName}>{errors.password}</p>
											)}
										</div>

										<button
											type="submit"
											disabled={isSubmitting}
											className="w-full px-8 py-2.5 rounded-full bg-white text-[#0041C1] font-medium hover:bg-white/90 transition-colors h-10 disabled:opacity-70"
										>
											{isSubmitting ? 'Signing in...' : 'Sign In'}
										</button>

										<p className="text-center text-sm text-white/80">
											Don&apos;t have an account?{' '}
											<button
												type="button"
												onClick={onSignUpClick ?? onClose}
												className="text-white font-medium underline"
											>
												Sign Up
											</button>
										</p>
									</form>
								</div>
							</motion.div>
						</div>

						{/* Mesh gradient background */}
						<motion.div
							initial={{ opacity: 0, scale: 2 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0 }}
							layout={false}
							transition={{ duration: 0.15, delay: 0.05 }}
							className="absolute h-full inset-0 overflow-hidden pointer-events-none"
							style={{ borderRadius: '24px' }}
						>
							<MeshGradient
								speed={1}
								colors={['#2452F1', '#022474', '#163DB9', '#0B1D99']}
								distortion={0.8}
								swirl={0.1}
								grainMixer={0}
								grainOverlay={0}
								className="inset-0 sticky top-0"
								style={{ height: '100%', width: '100%' }}
							/>
						</motion.div>

						{/* Close button */}
						<motion.button
							onClick={onClose}
							className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center text-white hover:bg-white/10 rounded-full"
							aria-label="Close"
						>
							<X className="h-5 w-5" />
						</motion.button>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
