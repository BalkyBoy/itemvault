'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const inputClassName =
	'w-full px-4 py-2.5 rounded-lg bg-[#001F63] border-0 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-10';

const labelClassName =
	'block text-[10px] font-mono font-normal text-white mb-2 tracking-[0.5px] uppercase';

const errorClassName = 'mt-1.5 text-xs text-red-200';

type FormField =
	| 'firstName'
	| 'lastName'
	| 'email'
	| 'password'
	| 'confirmPassword';

type FormErrors = Partial<Record<FormField | 'terms', string>>;

export interface SignupModalProps {
	isExpanded: boolean;
	onClose: () => void;
	onSignInClick?: () => void;
}

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupModal({
	isExpanded,
	onClose,
	onSignInClick,
}: SignupModalProps) {
	const router = useRouter();
	const { login } = useAuth();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as FormField]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[name as FormField];
				return next;
			});
		}
	};

	const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAcceptedTerms(e.target.checked);
		if (errors.terms) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next.terms;
				return next;
			});
		}
	};

	const validate = (): FormErrors => {
		const nextErrors: FormErrors = {};

		if (!formData.firstName.trim()) {
			nextErrors.firstName = 'First name is required';
		}
		if (!formData.lastName.trim()) {
			nextErrors.lastName = 'Last name is required';
		}
		if (!formData.email.trim()) {
			nextErrors.email = 'Email is required';
		} else if (!isValidEmail(formData.email)) {
			nextErrors.email = 'Enter a valid email address';
		}
		if (!formData.password) {
			nextErrors.password = 'Password is required';
		} else if (formData.password.length < 8) {
			nextErrors.password = 'Password must be at least 8 characters';
		}
		if (!formData.confirmPassword) {
			nextErrors.confirmPassword = 'Please confirm your password';
		} else if (formData.password !== formData.confirmPassword) {
			nextErrors.confirmPassword = 'Passwords do not match';
		}
		if (!acceptedTerms) {
			nextErrors.terms = 'You must accept the terms and conditions';
		}

		return nextErrors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setErrors({});
		setIsSubmitting(true);

		const payload = {
			firstName: formData.firstName.trim(),
			lastName: formData.lastName.trim(),
			email: formData.email.trim().toLowerCase(),
			password: formData.password,
		};

		try {
			const apiBase =
				process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

			const res = await fetch(`${apiBase}/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (res.ok && json.data?.tokens?.accessToken) {
				const { accessToken, refreshToken } = json.data.tokens;
				const u = json.data.user;
				login(accessToken, refreshToken ?? null, {
					id: u.id,
					email: u.email,
					firstName: u.firstName,
					lastName: u.lastName,
				});
				router.push('/dashboard');
				return;
			}
		} catch {
			// Handle network errors in a follow-up UX pass
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSignInClick = () => {
		if (onSignInClick) {
			onSignInClick();
		} else {
			onClose();
		}
	};

	return (
		<AnimatePresence initial={false}>
			{isExpanded && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-2">
					<motion.div
						layoutId="cta-card"
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
								<div className="flex-1 flex flex-col justify-center space-y-3 w-full">
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-none tracking-[-0.03em]">
										Create your account
									</h2>
									<p className="text-sm sm:text-base text-white/90 leading-[150%] pt-2 max-w-md">
										Get started today with a personal account. Access your
										dashboard and manage your profile and settings in one place.
									</p>
									<div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/20">
										<p className="text-lg sm:text-xl lg:text-2xl text-white leading-[150%] mb-4">
											I created my account in minutes and had full access to my
											dashboard right away.
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

								<div className="flex-1 w-full">
									<form
										className="space-y-4 sm:space-y-5"
										onSubmit={handleSubmit}
										noValidate
									>
										<div className="flex flex-col sm:flex-row gap-4">
											<div className="flex-1">
												<label htmlFor="firstName" className={labelClassName}>
													FIRST NAME *
												</label>
												<input
													id="firstName"
													name="firstName"
													value={formData.firstName}
													onChange={handleChange}
													className={inputClassName}
												/>
												{errors.firstName && (
													<p className={errorClassName}>{errors.firstName}</p>
												)}
											</div>
											<div className="flex-1">
												<label htmlFor="lastName" className={labelClassName}>
													LAST NAME *
												</label>
												<input
													id="lastName"
													name="lastName"
													value={formData.lastName}
													onChange={handleChange}
													className={inputClassName}
												/>
												{errors.lastName && (
													<p className={errorClassName}>{errors.lastName}</p>
												)}
											</div>
										</div>

										<div>
											<label htmlFor="email" className={labelClassName}>
												EMAIL ADDRESS *
											</label>
											<input
												id="email"
												name="email"
												type="email"
												value={formData.email}
												onChange={handleChange}
												className={inputClassName}
											/>
											{errors.email && (
												<p className={errorClassName}>{errors.email}</p>
											)}
										</div>

										<div>
											<label htmlFor="password" className={labelClassName}>
												PASSWORD *
											</label>
											<div className="relative">
												<input
													id="password"
													name="password"
													type={showPassword ? 'text' : 'password'}
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

										<div>
											<label
												htmlFor="confirmPassword"
												className={labelClassName}
											>
												CONFIRM PASSWORD *
											</label>
											<div className="relative">
												<input
													id="confirmPassword"
													name="confirmPassword"
													type={showConfirmPassword ? 'text' : 'password'}
													value={formData.confirmPassword}
													onChange={handleChange}
													className={`${inputClassName} pr-11`}
												/>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword((p) => !p)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
												>
													{showConfirmPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
											{errors.confirmPassword && (
												<p className={errorClassName}>
													{errors.confirmPassword}
												</p>
											)}
										</div>

										<div>
											<label className="flex items-start gap-3 cursor-pointer">
												<input
													type="checkbox"
													checked={acceptedTerms}
													onChange={handleTermsChange}
													className="mt-0.5 h-4 w-4"
												/>
												<span className="text-sm text-white/90">
													I agree to the Terms &amp; Conditions
												</span>
											</label>
											{errors.terms && (
												<p className={errorClassName}>{errors.terms}</p>
											)}
										</div>

										<button
											type="submit"
											disabled={isSubmitting}
											className="w-full px-8 py-2.5 rounded-full bg-white text-[#0041C1] font-medium hover:bg-white/90 transition-colors h-10 disabled:opacity-70"
										>
											{isSubmitting ? 'Creating Account...' : 'Create Account'}
										</button>

										<p className="text-center text-sm text-white/80">
											Already have an account?{' '}
											<button
												type="button"
												onClick={handleSignInClick}
												className="text-white font-medium underline"
											>
												Sign In
											</button>
										</p>
									</form>
								</div>
							</motion.div>
						</div>
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
