import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AccountsOverview } from '@/components/accounts/AccountsOverview';
import { AccountsActionBar } from '@/components/accounts/AccountsActionBar';
import { AccountsTable } from '@/components/accounts/AccountsTable';
import { AccountQuickInfo } from '@/components/accounts/AccountQuickInfo';
import { AddAccountModal } from '@/components/accounts/AddAccountModal';
import { useAccountsData } from '@/hooks/useAccountsData';
import { useToast } from '@/hooks/use-toast';

const Accounts = () => {
  const [isFundingAll, setIsFundingAll] = useState(false);
  const { toast } = useToast();

  const {
    filteredAccounts,
    overview,
    filters,
    selectedAccount,
    isQuickInfoOpen,
    isAddModalOpen,
    setFilters,
    openQuickInfo,
    closeQuickInfo,
    openAddModal,
    closeAddModal,
    createAccount,
    fundAccount,
    fundLowGasAccounts,
    blockAccount,
    unblockAccount,
    regenerateApiKey,
  } = useAccountsData();

  const handleFundLowGas = async () => {
    setIsFundingAll(true);
    const count = await fundLowGasAccounts();
    toast({
      title: 'Accounts Funded',
      description: `Successfully funded ${count} low gas accounts`,
    });
    setIsFundingAll(false);
  };

  const handleFundAccount = async (accountId: string) => {
    await fundAccount(accountId);
    toast({
      title: 'Account Funded',
      description: 'Successfully added 100 ICT to account',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeItem="users" />

      <main className="ml-16 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="w-10 h-10 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Network Access – Accounts</h1>
                <p className="text-sm text-muted-foreground">
                  Manage account identity, access control, and gas funding
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {overview.total} Total Accounts
              </span>
            </div>
          </motion.header>

          {/* Row 1: Overview Badges */}
          <div className="mb-6">
            <AccountsOverview overview={overview} />
          </div>

          {/* Row 2: Action Bar */}
          <div className="mb-6">
            <AccountsActionBar
              filters={filters}
              lowGasCount={overview.lowGas}
              onFilterChange={setFilters}
              onAddAccount={openAddModal}
              onFundLowGas={handleFundLowGas}
              isFunding={isFundingAll}
            />
          </div>

          {/* Row 3: Accounts Table */}
          <AccountsTable
            accounts={filteredAccounts}
            onSelectAccount={openQuickInfo}
            onFundAccount={handleFundAccount}
            onViewInfo={openQuickInfo}
          />

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-border/50 text-xs text-muted-foreground text-center"
          >
            <p>Network-level account access control • All changes are logged</p>
          </motion.footer>
        </div>
      </main>

      {/* Quick Info Panel */}
      <AccountQuickInfo
        account={selectedAccount}
        isOpen={isQuickInfoOpen}
        onClose={closeQuickInfo}
        onFund={fundAccount}
        onBlock={blockAccount}
        onUnblock={unblockAccount}
        onRegenerateApiKey={regenerateApiKey}
      />

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onCreateAccount={createAccount}
      />
    </div>
  );
};

export default Accounts;
