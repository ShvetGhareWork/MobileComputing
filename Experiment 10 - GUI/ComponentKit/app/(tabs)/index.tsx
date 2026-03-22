import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  TextInput,
  Button,
  Switch,
  Checkbox,
  RadioButton,
  Text,
  ProgressBar,
  ActivityIndicator,
  Chip,
  Badge,
  Avatar,
  Tooltip,
  SegmentedButtons,
  FAB,
  Card,
  useTheme,
  Divider,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';

export default function ComponentGalleryScreen() {
  const theme = useTheme();

  // State for interactive components
  const [textInput, setTextInput] = useState('');
  const [switchState, setSwitchState] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);
  const [radioState, setRadioState] = useState('first');
  const [sliderValue, setSliderValue] = useState(50);
  const [chipSelected, setChipSelected] = useState(false);
  const [segmentedValue, setSegmentedValue] = useState('walk');
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* TextInput */}
        <Card style={styles.card}>
          <Card.Title title="TextInput" />
          <Card.Content style={styles.contentSpacing}>
            <TextInput
              label="Default TextInput"
              value={textInput}
              onChangeText={setTextInput}
            />
            <TextInput
              label="Outlined TextInput"
              mode="outlined"
              value={textInput}
              onChangeText={setTextInput}
            />
            <TextInput
              label="Password Input"
              secureTextEntry
              right={<TextInput.Icon icon="eye" />}
            />
            <TextInput
              label="Multiline Input"
              multiline
              numberOfLines={3}
            />
          </Card.Content>
        </Card>

        {/* Buttons */}
        <Card style={styles.card}>
          <Card.Title title="Buttons" />
          <Card.Content style={[styles.contentSpacing, { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }]}>
            <Button mode="contained" onPress={() => console.log('Contained pressed')}>
              Contained
            </Button>
            <Button mode="outlined" onPress={() => console.log('Outlined pressed')}>
              Outlined
            </Button>
            <Button mode="text" onPress={() => console.log('Text pressed')}>
              Text
            </Button>
            <Button mode="contained" loading onPress={() => console.log('Loading pressed')}>
              Loading
            </Button>
          </Card.Content>
        </Card>

        {/* Switch & Checkbox */}
        <Card style={styles.card}>
          <Card.Title title="Switch & Checkbox" />
          <Card.Content style={styles.contentSpacing}>
            <View style={styles.row}>
              <Text>Switch State: {switchState ? 'ON' : 'OFF'}</Text>
              <Switch value={switchState} onValueChange={setSwitchState} />
            </View>
            <View style={styles.row}>
              <Text>Checkbox State: {checkboxState ? 'CHECKED' : 'UNCHECKED'}</Text>
              <Checkbox
                status={checkboxState ? 'checked' : 'unchecked'}
                onPress={() => setCheckboxState(!checkboxState)}
              />
            </View>
          </Card.Content>
        </Card>

        {/* RadioButton */}
        <Card style={styles.card}>
          <Card.Title title="RadioButton" />
          <Card.Content>
            <RadioButton.Group onValueChange={newValue => setRadioState(newValue)} value={radioState}>
              <RadioButton.Item label="Option First" value="first" />
              <RadioButton.Item label="Option Second" value="second" />
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Slider */}
        <Card style={styles.card}>
          <Card.Title title="Slider" />
          <Card.Content style={styles.contentSpacing}>
            <Text>Value: {Math.round(sliderValue)}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.surfaceVariant}
              value={sliderValue}
              onValueChange={setSliderValue}
            />
          </Card.Content>
        </Card>

        {/* Progress */}
        <Card style={styles.card}>
          <Card.Title title="Progress Indicators" />
          <Card.Content style={[styles.contentSpacing, { alignItems: 'center' }]}>
            <ActivityIndicator animating={true} size="large" />
            <ProgressBar progress={sliderValue / 100} style={{ width: '100%', marginTop: 20 }} />
          </Card.Content>
        </Card>

        {/* Chip */}
        <Card style={styles.card}>
          <Card.Title title="Chips" />
          <Card.Content style={[styles.contentSpacing, { flexDirection: 'row', gap: 10 }]}>
            <Chip selected={chipSelected} onPress={() => setChipSelected(!chipSelected)}>
              Selectable Chip
            </Chip>
            <Chip onClose={() => console.log('Chip dismissed')}>
              Dismissible Chip
            </Chip>
          </Card.Content>
        </Card>

        {/* Badge & Avatar */}
        <Card style={styles.card}>
          <Card.Title title="Avatar & Badge" />
          <Card.Content style={[styles.contentSpacing, { flexDirection: 'row', gap: 20, alignItems: 'center' }]}>
            <View>
              <Badge style={{ position: 'absolute', top: -5, right: -5, zIndex: 1 }}>3</Badge>
              <Avatar.Icon size={48} icon="folder" />
            </View>
            <Avatar.Text size={48} label="XD" />
          </Card.Content>
        </Card>

        {/* Tooltip & SegmentedButtons */}
        <Card style={styles.card}>
          <Card.Title title="Tooltip & Segments" />
          <Card.Content style={styles.contentSpacing}>
            <Tooltip title="This is a very helpful tooltip on long press!">
              <Button mode="outlined">Long Press Me</Button>
            </Tooltip>

            <View style={{ marginTop: 20 }}>
              <SegmentedButtons
                value={segmentedValue}
                onValueChange={setSegmentedValue}
                buttons={[
                  { value: 'walk', label: 'Walking' },
                  { value: 'transit', label: 'Transit' },
                  { value: 'drive', label: 'Driving' },
                ]}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Bottom spacer for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Individual FABs (web-safe alternative to FAB.Group) */}
      <View style={{ position: 'absolute', right: 16, bottom: 16, alignItems: 'flex-end' }}>
        {fabOpen && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ marginRight: 8, backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>Add</Text>
              <FAB icon="plus" size="small" onPress={() => console.log('Pressed add')} accessibilityLabel="Add" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ marginRight: 8, backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>Star</Text>
              <FAB icon="star" size="small" onPress={() => console.log('Pressed star')} accessibilityLabel="Star" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ marginRight: 8, backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>Email</Text>
              <FAB icon="email" size="small" onPress={() => console.log('Pressed email')} accessibilityLabel="Email" />
            </View>
          </>
        )}
        <FAB
          icon={fabOpen ? 'close' : 'plus'}
          onPress={() => setFabOpen(!fabOpen)}
          accessibilityLabel="Toggle Menu"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    marginBottom: 16,
  },
  contentSpacing: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
