import { customerStats, customersList } from '@admin/data/mockData';
import CustomerHeader from '../components/CustomerHeader';
import CustomerStatCard from '../components/CustomerStatCard';
import CustomerTable from '../components/CustomerTable';

const CustomersPage = () => {
    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <CustomerHeader />

            {/* Stats Grid */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <CustomerStatCard
                    label="Total Customers"
                    value={customerStats.total}
                    icon="Users"
                />
                <CustomerStatCard
                    label="Active Customers"
                    value={customerStats.active}
                    icon="UserCheck"
                />
                <CustomerStatCard
                    label="New This Month"
                    value={customerStats.newThisMonth}
                    icon="UserPlus"
                />
                <CustomerStatCard
                    label="Total Revenue"
                    value={customerStats.totalRevenue / 1000}
                    icon="DollarSign"
                    prefix="$"
                />
            </div>

            {/* Customer List Section */}
            <div>
                <CustomerTable customers={customersList} />
            </div>
        </div>
    );
};

export default CustomersPage;
