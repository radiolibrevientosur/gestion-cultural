import React from 'react';
import { Feed } from './Feed';
import { QuickPost } from './QuickPost';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <QuickPost />
      <Feed />
    </div>
  );
};

export default Dashboard;