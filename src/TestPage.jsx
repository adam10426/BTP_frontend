import { Button, Text, Paper } from '@mantine/core';

const TestPage = ({ title = 'Test Page' }) => {
  return (
    <Paper shadow="sm" p="lg" className="max-w-4xl mx-auto mt-8">
      <Text size="xl" fw={700} className="mb-4">{title}</Text>
      <Text className="mb-6">
        This is a test page to verify routing and layout functionality.
        If you can see this, the basic routing is working correctly.
      </Text>
      <div className="space-x-4">
        <Button variant="filled">Primary Action</Button>
        <Button variant="outline">Secondary Action</Button>
      </div>
    </Paper>
  );
};

export default TestPage;
