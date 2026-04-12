import { useState, useEffect } from 'react';
import { User, Mail, Save, RotateCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Input from '@common/Input';
import Button from '@common/Button';
import ProfileImageUpload from './ProfileImageUpload';
import { useUpdateProfileMutation } from '@/hooks/useAuthQueries';
import useAuthStore from '@/store/useAuthStore';
import * as toast from '@/utils/toast';

const EditProfileForm = () => {
    const { user } = useAuthStore();
    const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const { register, handleSubmit, formState: {errors}, reset, setValue } = useForm({
        defaultValues: {
            name: '',
        }
    });

    // Set form values when user data is available
    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        
        if (selectedAvatar) {
            formData.append('avatar', selectedAvatar);
        }

        try {
            await updateProfile(formData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.log(error)
            toast.error(error?.message || 'Failed to update profile');
        }
    };

    const handleReset = () => {
        if (user) {
            reset({ name: user.name || '' });
        }
        setSelectedAvatar(null);
    };
    return (
        <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl shadow-primary/10 p-8 md:p-12 border border-slate-50">
            {/* Profile Image Section */}
            <ProfileImageUpload 
                value={user?.avatar} 
                onChange={setSelectedAvatar} 
            />

            {/* Title */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Edit Profile
                </h2>
                <p className="text-slate-400 text-sm mt-2 font-medium">
                    Keep your personal information up to date
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Full Name */}
                <Input
                    id="name"
                    label="Full Name"
                    placeholder="Enter Full Name"
                    icon={User}
                    register={register('name', { 
                        required: 'Name is required', 
                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                        maxLength: { value: 50, message: 'Name must not exceed 50 characters' }
                    })}
                    error={errors.name?.message}
                />

                {/* Email - Read Only */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <div className="relative">
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 placeholder:text-slate-400 pl-11 pr-4 cursor-not-allowed"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Mail size={18} />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-100">
                    <Button 
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 hover:bg-slate-100 text-slate-500 font-semibold"
                        disabled={isPending}
                    >
                        <RotateCcw size={18} />
                        Reset
                    </Button>
                    <Button 
                        type="submit" 
                        className="px-8 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        loading={isPending}
                        disabled={isPending}
                    >
                        <Save size={18} />
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileForm;
