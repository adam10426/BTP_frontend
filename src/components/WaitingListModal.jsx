import { Modal, Button, Text, Stack, Group } from '@mantine/core';
import { IconClockHour4, IconX, IconCheck } from '@tabler/icons-react';

const WaitingListModal = ({ opened, onClose, onConfirm, userName }) => {
  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title="Move to Waiting List"
      centered
      size="md"
      radius="md"
    >
      <Stack gap="md">
        <Text size="sm">
          Are you sure you want to move <Text span fw={700}>{userName}</Text> to the waiting list?
        </Text>
        
        <Group justify="flex-end" mt="md">
          <Button 
            variant="default" 
            leftSection={<IconX size={16} />}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            color="orange" 
            leftSection={<IconClockHour4 size={16} />}
            onClick={onConfirm}
          >
            Move to Waiting List
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default WaitingListModal;
