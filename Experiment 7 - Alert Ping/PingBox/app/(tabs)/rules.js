import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function RulesScreen() {
  const { alertRules, addAlertRule, deleteAlertRule } = useAppContext();
  const [keyword, setKeyword] = useState('');
  const [priority, setPriority] = useState('high');

  const handleAddRule = async () => {
    if (keyword.trim()) {
      await addAlertRule(keyword.trim(), 'default', 1, priority);
      setKeyword('');
    }
  };

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'max': return '#B71C1C';
      case 'high': return '#F44336';
      case 'default': return '#FFC107';
      case 'low': return '#9E9E9E';
      default: return '#000';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.ruleCard}>
      <View style={styles.ruleInfo}>
        <Text style={styles.keyword}>"{item.keyword}"</Text>
        <Text style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          {item.priority.toUpperCase()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteAlertRule(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          placeholder="Keyword (e.g., urgent)"
          value={keyword}
          onChangeText={setKeyword}
        />
        <View style={styles.prioritySelector}>
          {['low', 'default', 'high', 'max'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.priorityOption, priority === p && styles.priorityOptionSelected]}
              onPress={() => setPriority(p)}
            >
              <Text style={[styles.priorityText, priority === p && styles.priorityTextSelected]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Add Rule" onPress={handleAddRule} />
      </View>

      <FlatList
        data={alertRules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No rules defined.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  addSection: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  priorityOption: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  priorityOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityText: {
    color: '#333',
  },
  priorityTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  ruleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  ruleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyword: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  priorityBadge: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  deleteText: {
    color: '#FF3B30',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
});
