import { Modal, TextInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import userService from '../db/services/userService';

export default function ReceiptModal({ opened, onClose, userId, onReceiptSubmit }) {
  const form = useForm({
    initialValues: {
      receiptNumber: '',
    },
    validate: {
      receiptNumber: (value) => (value ? null : 'Receipt number is required'),
    },
  });

  const handleSubmit = async (values) => {
    try {
      await onReceiptSubmit(userId, values.receiptNumber);
      notifications.show({
        title: 'Success',
        message: 'Receipt number updated successfully',
        color: 'green',
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error updating receipt:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update receipt number',
        color: 'red',
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Receipt Number"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Receipt Number"
            placeholder="Enter receipt number"
            required
            {...form.getInputProps('receiptNumber')}
          />
          <Button type="submit" fullWidth mt="md">
            Submit
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
