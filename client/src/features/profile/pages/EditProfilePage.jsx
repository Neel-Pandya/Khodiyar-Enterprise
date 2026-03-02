import EditProfileForm from '../components/EditProfileForm';

const EditProfilePage = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                <EditProfileForm />
            </div>
        </div>
    );
};

export default EditProfilePage;
