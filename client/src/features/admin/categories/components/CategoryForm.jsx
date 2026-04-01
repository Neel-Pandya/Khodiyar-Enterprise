import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Folder, FolderCheck, RotateCcw, ChevronDown, Loader2 } from 'lucide-react';

import FormSectionCard from '@admin/shared/components/FormSectionCard';

const INITIAL_FORM = {
    name: '',
    status: 'active',
};

const CategoryForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }) => {
    const isEdit = !!initialData;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: initialData?.name || '',
            status: (initialData?.status || 'active').toLowerCase(),
        },
    });

    useEffect(() => {
        reset({
            name: initialData?.name || '',
            status: (initialData?.status || 'active').toLowerCase(),
        });
    }, [initialData, reset]);

    const handleReset = () => {
        if (onCancel) {
            onCancel();
            return;
        }
        reset(INITIAL_FORM);
    };

    const onFormSubmit = (data) => {
        const payload = {
            name: data.name.trim(),
            status: data.status.toLowerCase(),
        };

        if (onSubmit) onSubmit(payload);
    };

    const getButtonContent = () => {
        if (isSubmitting) {
            return (
                <>
                    <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                    {isEdit ? 'Saving...' : 'Creating...'}
                </>
            );
        }
        return (
            <>
                {isEdit ? <RotateCcw size={16} strokeWidth={2.5} /> : <FolderCheck size={16} strokeWidth={2.5} />}
                {isEdit ? 'Save Changes' : 'Add Category'}
            </>
        );
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <div className="flex flex-col gap-6">
                <FormSectionCard title="Category Information" icon={Folder}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: 'Category name is required',
                                    validate: (value) => value.trim().length >= 2
                                        || 'Name must be at least 2 characters long',
                                }}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            Category Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <Folder size={16} strokeWidth={2} />
                                            </div>
                                            <input
                                                type="text"
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="e.g. Electronics"
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111827] font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d] hover:border-gray-300"
                                            />
                                        </div>
                                    </div>
                                )}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <Controller
                                name="status"
                                control={control}
                                rules={{
                                    required: 'Status is required',
                                }}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            Status
                                        </label>

                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <FolderCheck size={16} strokeWidth={2} />
                                            </div>

                                            <select
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="
                                                    w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111827]
                                                    font-medium transition-all duration-200 outline-none
                                                    focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d]
                                                    hover:border-gray-300 appearance-none
                                                "
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>

                                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <ChevronDown size={16} strokeWidth={2} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                            {errors.status && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.status.message}</p>
                            )}
                        </div>
                    </div>
                </FormSectionCard>

                {/* Action Bar */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <RotateCcw size={15} strokeWidth={2.5} />
                        {isEdit ? 'Cancel' : 'Reset'}
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                            ${isSubmitting
                                ? 'bg-gray-400 text-white'
                                : 'bg-[#fbc02d] hover:bg-[#fbbf24] text-[#1e3a5f] shadow-[#fbc02d]/20'
                            }
                        `}
                    >
                        {getButtonContent()}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CategoryForm;
