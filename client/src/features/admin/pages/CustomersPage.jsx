import React from 'react';
import { motion } from 'framer-motion';
import { customerStats, customersList } from '../data/mockData';
import CustomerHeader from '../components/CustomerHeader';
import CustomerStatCard from '../components/CustomerStatCard';
import CustomerTable from '../components/CustomerTable';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const CustomersPage = () => {
    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <CustomerHeader />

            {/* Stats Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
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
            </motion.div>

            {/* Customer List Section */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <CustomerTable customers={customersList} />
            </motion.div>
        </div>
    );
};

export default CustomersPage;
