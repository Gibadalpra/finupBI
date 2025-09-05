import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import Login from "pages/login";
import Home from "pages/home";
import Dashboard from "pages/dashboard";
import TransactionsManagement from "pages/transactions-management";
import FinancialReports from "pages/financial-reports";
import BankReconciliation from "pages/bank-reconciliation";
import ClientPortal from "pages/client-portal";
import TaxComplianceCenter from "pages/tax-compliance-center";
import UserManagement from "pages/user-management";
import ClientManagement from "pages/client-management";
import ClientUserManagement from "pages/client-user-management";
import DataImport from "pages/data-import";
import PlannedImport from "pages/planned-import";
import ChartOfAccounts from "pages/chart-of-accounts";
import AccountMapping from "pages/account-mapping";
import ProfileSettings from "pages/profile-settings";
import Inadimplencia from "./pages/Inadimplencia";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions-management" element={<TransactionsManagement />} />
          <Route path="/financial-reports" element={<FinancialReports />} />
          <Route path="/bank-reconciliation" element={<BankReconciliation />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/tax-compliance-center" element={<TaxComplianceCenter />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/client-management" element={<ClientManagement />} />
          <Route path="/client-user-management" element={<ClientUserManagement />} />
          <Route path="/data-import" element={<DataImport />} />
          <Route path="/planned-import" element={<PlannedImport />} />
          <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
          <Route path="/account-mapping" element={<AccountMapping />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/inadimplencia" element={<Inadimplencia />} />
          <Route path="/" element={<Home />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;