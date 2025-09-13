import { NavLink } from 'react-router-dom';
import { Text, Stack, Group, Box, Image, ActionIcon, NavLink as MantineNavLink, Divider } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { 
  IconReceipt,
  IconX
} from '@tabler/icons-react';

const navLinks = [
  { 
    icon: <IconReceipt size={20} />, 
    label: 'Receipt', 
    to: '/',
    description: 'Generate Receipt'
  },
];

const BaseSidebar = ({toggle}) => {

  const { width } = useViewportSize();

  return (
    <>
    <Stack h="100vh" >
      <Stack p="md" h={67} 
      styles={(theme)=>({
        root:{borderBottom: `1px solid`, borderColor: 'gray'}
      })}>
        <Group w="100%" gap={12}>
          <Box w={40} >
            <Image src="https://crawleydistrictscouts.co.uk/wp-content/uploads/2020/12/png-transparent-line-leader-scouting-scout-association-scout-group-world-scout-emblem-scout-district-explorer-scouts-young-leaders-logo-scout-leader-thumbnail.png" radius="md" fit="contain"/>
          </Box>
          <Stack gap={0} justify="center">
            <Text size="sm" fw={500}>John Doe</Text>
            <Text size="xs">Admin</Text>
          </Stack>
          {width < 768 && (
              <ActionIcon
                ml="auto"
                variant="transparent"
                onClick={() => toggle()}
              >
              <IconX size={24} />
            </ActionIcon>
          )}
        </Group>
      </Stack>
      <Stack p="md" gap={2}>
        {navLinks.map((link) => (
           <MantineNavLink
              component={NavLink}
              to={link.to}
              rightSection={<></>}
              label={link.label}
              leftSection={link.icon}
              style={{
                padding: '0.5rem 1rem',
                marginBottom: '0.25rem',
                borderRadius: '6px',
              }}
          />
        ))}
      </Stack>
    </Stack>
    </>
  );
};

export default BaseSidebar;
