import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <Container size="lg" px="xs" py="xl">
      <Paper radius="md" p={{ base: 'md', sm: 'xl' }} withBorder>
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title order={2}>Welcome to Dashboard</Title>
            <Button variant="light" color="red" onClick={logout} size="md">
              Logout
            </Button>
          </Group>

          <Text size="lg">
            You have successfully logged in! This is your protected dashboard
            page.
          </Text>

          <Text size="sm" c="dimmed">
            You can add more content and features to this dashboard page.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
