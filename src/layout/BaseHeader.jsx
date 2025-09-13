import { Group, Burger, Text, Avatar, Menu, ActionIcon, useMantineColorScheme, Box, Divider } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

const BaseHeader = ({ opened, toggle }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const { width } = useViewportSize();

  return (
    <Box h={60}>
      <Group p="md" justify='flex-start' w="100%" 
      styles={(theme)=>({
        root:{borderBottom: `1px solid`, borderColor: 'gray'}
      })}>
        {width < 768 && (
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            aria-label="Toggle navigation"
          />
        )}
        <Group ml="auto" gap={12}>
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
              size="lg"
            >
            {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
        </Group>

      </Group>
    </Box>
    // <div className="h-full px-4 flex items-center">
    //   <Group justify="space-between" className="w-full">
    //     <Group>
    //       <Burger
    //         opened={opened}
    //         onClick={toggle}
    //         size="sm"
    //         className="md:hidden"
    //         aria-label="Toggle navigation"
    //       />
    //     </Group>

    //     <Group>
    //       <ActionIcon
    //         variant="outline"
    //         color={dark ? 'yellow' : 'blue'}
    //         onClick={() => toggleColorScheme()}
    //         title="Toggle color scheme"
    //         size="lg"
    //       >
    //         {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    //       </ActionIcon>

    //       <Menu shadow="md" width={200} position="bottom-end">
    //         <Menu.Target>
    //           <Group className="cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
    //             <Avatar 
    //               src="https://i.pravatar.cc/150?img=32" 
    //               alt="User" 
    //               radius="xl"
    //               size={32}
    //             />
    //             <Text size="sm" fw={500} className="hidden sm:block">John Doe</Text>
    //             <IconChevronDown size={16} className="hidden sm:block" />
    //           </Group>
    //         </Menu.Target>

    //         <Menu.Dropdown>
    //           <Menu.Label>Application</Menu.Label>
    //           <Menu.Item leftSection={<IconUser size={16} />}>
    //             Profile
    //           </Menu.Item>
    //           <Menu.Item leftSection={<IconSettings size={16} />}>
    //             Settings
    //           </Menu.Item>

    //           <Menu.Divider />

    //           <Menu.Item
    //             color="red"
    //             leftSection={<IconLogout size={16} />}
    //           >
    //             Logout
    //           </Menu.Item>
    //         </Menu.Dropdown>
    //       </Menu>
    //     </Group>
    //   </Group>
    // </div>
  );
};

export default BaseHeader;