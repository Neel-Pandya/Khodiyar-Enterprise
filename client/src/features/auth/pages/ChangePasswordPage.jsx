import React from 'react';
import ChangePasswordForm from '../components/ChangePasswordForm';

const ChangePasswordPage = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-bg-light/50 px-6 py-12">
            <div className="w-full max-w-[480px]">
                <ChangePasswordForm />
                
                {/* Extra information or links can go here if needed */}
                <p className="text-center text-slate-400 text-xs mt-8 font-medium">
                    &copy; 2026 Khodiyar Enterprise. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
