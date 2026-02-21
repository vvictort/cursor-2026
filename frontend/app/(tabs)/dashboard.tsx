import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/auth/SessionProvider';
import { supabase } from '@/auth/supabase';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

type PrivateNote = {
  id: string;
  note: string;
  created_at: string;
};

const MISSING_TABLE_ERROR_CODE = '42P01';

const formatSupabaseError = (error: { code?: string | null; message: string }) => {
  if (error.code === MISSING_TABLE_ERROR_CODE) {
    return 'RLS test table is missing. Run `frontend/supabase/rls_private_notes.sql` in the Supabase SQL editor, then refresh.';
  }

  return error.message;
};

export default function DashboardScreen() {
  const { user, session } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [notes, setNotes] = useState<PrivateNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [rlsError, setRlsError] = useState<string | null>(null);

  const accessTokenPreview = useMemo(() => {
    if (!session?.access_token) {
      return 'No token';
    }

    return `${session.access_token.slice(0, 24)}...`;
  }, [session?.access_token]);

  const loadNotes = useCallback(async () => {
    setLoadingNotes(true);
    setRlsError(null);

    const { data, error } = await supabase
      .from('private_notes')
      .select('id,note,created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      setRlsError(formatSupabaseError(error));
      setNotes([]);
    } else {
      setNotes(data ?? []);
    }

    setLoadingNotes(false);
  }, []);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const handleAddNote = async () => {
    const trimmedNote = newNote.trim();
    if (!trimmedNote) {
      Alert.alert('Note required', 'Add some text first.');
      return;
    }

    setSavingNote(true);
    setRlsError(null);

    const { error } = await supabase.from('private_notes').insert({ note: trimmedNote });

    setSavingNote(false);
    if (error) {
      setRlsError(formatSupabaseError(error));
      return;
    }

    setNewNote('');
    await loadNotes();
  };

  const handleDeleteNote = async (id: string) => {
    setRlsError(null);
    const { error } = await supabase.from('private_notes').delete().eq('id', id);

    if (error) {
      setRlsError(formatSupabaseError(error));
      return;
    }

    await loadNotes();
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <IconSymbol name="chart.bar.fill" size={48} color={colors.tint} />
          <ThemedText type="title" style={styles.title}>
            Dashboard
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Protected route — JWT required
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">User</ThemedText>
          <ThemedText>{user?.email ?? '—'}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">User ID</ThemedText>
          <ThemedText style={styles.mono}>{user?.id ?? '—'}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">JWT Session</ThemedText>
          <ThemedText>{session ? 'Active (JWT valid)' : 'None'}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">Access Token Preview</ThemedText>
          <ThemedText style={styles.mono}>{accessTokenPreview}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.rlsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            RLS Smoke Test (`private_notes`)
          </ThemedText>

          <ThemedText style={styles.hintText}>
            Add a note below, then sign in with another user account. You should only see each
            account&apos;s own notes.
          </ThemedText>

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
            placeholder="Write a private note"
            placeholderTextColor={colors.icon}
            value={newNote}
            onChangeText={setNewNote}
            editable={!savingNote}
          />

          <ThemedView style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.tint }]}
              onPress={handleAddNote}
              disabled={savingNote}
            >
              {savingNote ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.actionButtonText}>Add Note</ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.refreshButton, { borderColor: colors.tint }]}
              onPress={() => void loadNotes()}
              disabled={loadingNotes}
            >
              <ThemedText type="link">Refresh</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {rlsError && (
            <ThemedView style={styles.errorCard}>
              <ThemedText type="defaultSemiBold">RLS/Test Error</ThemedText>
              <ThemedText style={styles.hintText}>{rlsError}</ThemedText>
            </ThemedView>
          )}

          {loadingNotes ? (
            <ActivityIndicator />
          ) : notes.length === 0 ? (
            <ThemedText style={styles.hintText}>No notes yet for this user.</ThemedText>
          ) : (
            <ThemedView style={styles.notesList}>
              {notes.map((note) => (
                <ThemedView key={note.id} style={styles.noteCard}>
                  <ThemedText>{note.note}</ThemedText>
                  <ThemedText style={styles.mono}>{new Date(note.created_at).toLocaleString()}</ThemedText>
                  <TouchableOpacity onPress={() => void handleDeleteNote(note.id)}>
                    <ThemedText type="link">Delete</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginTop: 12,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  rlsSection: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
  },
  sectionTitle: {
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    opacity: 0.9,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionButton: {
    height: 44,
    minWidth: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  refreshButton: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  notesList: {
    gap: 10,
  },
  noteCard: {
    gap: 6,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
  },
  errorCard: {
    gap: 6,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.6)',
    backgroundColor: 'rgba(255,107,107,0.1)',
  },
});
