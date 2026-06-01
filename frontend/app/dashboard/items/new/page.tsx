'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Card,
  Input,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  Textarea,
} from '@/components/dashboard/ui';
import { createItem } from '@/lib/api';
import { CategorySelect } from '@/components/dashboard/CategorySelect';
import { StatusSelect } from '@/components/dashboard/StatusSelect';
import type { ItemStatus } from '@/lib/types';

type FormData = {
  name: string;
  description: string;
  category: string;
  status: ItemStatus | '';
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  name: '',
  description: '',
  category: 'Other',
  status: 'active',
};

export default function AddItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormData];
        return next;
      });
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!formData.name.trim()) next.name = 'Name is required';
    if (!formData.description.trim()) next.description = 'Description is required';
    if (!formData.category.trim()) next.category = 'Category is required';
    if (!formData.status) next.status = 'Status is required';
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await createItem({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        status: formData.status as ItemStatus,
      });
      router.push('/dashboard/items');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to create item'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Add item"
        description="Create a new entry in your inventory"
        action={<SecondaryButton href="/dashboard/items">Cancel</SecondaryButton>}
      />

      <Card hover={false} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <Input
            label="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            error={errors.name}
            placeholder="Item name"
          />

          <Textarea
            label="Description"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            error={errors.description}
            placeholder="Describe this item"
          />

          <CategorySelect
            label="Category"
            value={formData.category}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, category: val }));
              if (errors.category) setErrors((prev) => { const n = { ...prev }; delete n.category; return n; });
            }}
            error={errors.category}
            required
          />

          <StatusSelect
            label="Status"
            value={formData.status}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, status: val as ItemStatus | '' }));
              if (errors.status) setErrors((prev) => { const n = { ...prev }; delete n.status; return n; });
            }}
            error={errors.status}
          />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <SecondaryButton href="/dashboard/items">Cancel</SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create item'}
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </>
  );
}
