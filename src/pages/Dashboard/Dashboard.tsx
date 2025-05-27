import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Slider } from '@/components/UI/slider';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const planItems = [
    { label: "Ideas generated", current: 20, max: 40 },
    { label: "Active themes", current: 1, max: 2 },
    { label: "Posts generated", current: 1, max: 3 },
    { label: "Posts rewritten", current: 0, max: 3 },
    { label: "Comments generated", current: 0, max: 30 },
    { label: "Extension posts", current: 0, max: 5 },
    { label: "Data refreshes", current: 0, max: 0 },
    { label: "Chat messages", current: 0, max: 2 },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Klarus Dashboard
        </h1>

        {user && (
          <h2 className="text-xl text-gray-600 dark:text-gray-300">
            Welcome, {user.user_metadata?.full_name || user.email || 'User'}!
          </h2>
        )}

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Plan usage</CardTitle>
              <Button variant="outline" size="sm">Upgrade limits</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {planItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.current}/{item.max}
                  </span>
                </div>
                <Slider
                  value={[item.current]}
                  max={item.max > 0 ? item.max : 1}
                  disabled={item.max === 0}
                  className="my-1"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
