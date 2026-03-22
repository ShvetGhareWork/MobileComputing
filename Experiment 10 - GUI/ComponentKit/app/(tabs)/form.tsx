import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, RadioButton, Switch, Text, SegmentedButtons, Snackbar, useTheme, Avatar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { saveSubmission, FormSubmission } from '../../src/services/formService';
import { useAppContext } from '../../src/context/AppContext';

export default function FormScreen() {
  const theme = useTheme();
  const { setThemePreference, updateSubmissionCount } = useAppContext();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSubmission>({
    defaultValues: {
      full_name: '',
      email: '',
      age: 18,
      gender: 'Male',
      country: 'USA', // Simple text input for now, Menu dropdown picker later if needed
      notifications_enabled: 1,
      preferred_theme: 'System',
      rating: 5,
      bio: '',
      profile_photo_uri: null,
    },
  });

  const onSubmit = async (data: FormSubmission) => {
    try {
      await saveSubmission(data);
      if (data.preferred_theme === 'Light' || data.preferred_theme === 'Dark' || data.preferred_theme === 'System') {
        setThemePreference(data.preferred_theme as any);
      }
      await updateSubmissionCount();
      setSnackbarVisible(true);
      reset();
    } catch (e) {
      console.error('Submission failed', e);
    }
  };

  const pickImage = async (onChange: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Controller
          control={control}
          rules={{ required: 'Full Name is required' }}
          name="full_name"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                right={<TextInput.Affix text={`${value.length}/50`} />}
                error={!!errors.full_name}
              />
              {errors.full_name && <Text style={styles.error}>{errors.full_name.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          rules={{
            required: 'Email is required',
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
          }}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={!!errors.email}
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          rules={{
            required: 'Age is required',
            min: { value: 13, message: 'Must be at least 13' },
            max: { value: 120, message: 'Must be under 120' }
          }}
          name="age"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                label="Age"
                keyboardType="numeric"
                value={value.toString()}
                onChangeText={text => onChange(Number(text.replace(/[^0-9]/g, '')))}
                error={!!errors.age}
              />
              {errors.age && <Text style={styles.error}>{errors.age.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={styles.label}>Gender</Text>
              <RadioButton.Group onValueChange={onChange} value={value}>
                <RadioButton.Item label="Male" value="Male" />
                <RadioButton.Item label="Female" value="Female" />
                <RadioButton.Item label="Other" value="Other" />
                <RadioButton.Item label="Prefer not to say" value="Prefer not to say" />
              </RadioButton.Group>
            </View>
          )}
        />

        <Controller
          control={control}
          rules={{ required: 'Country is required' }}
          name="country"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                label="Country"
                value={value}
                onChangeText={onChange}
                error={!!errors.country}
              />
              {errors.country && <Text style={styles.error}>{errors.country.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="notifications_enabled"
          render={({ field: { onChange, value } }) => (
            <View style={styles.row}>
              <Text>Enable Notifications</Text>
              <Switch value={value === 1} onValueChange={val => onChange(val ? 1 : 0)} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="preferred_theme"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldSpacing}>
              <Text style={styles.label}>Preferred Theme</Text>
              <SegmentedButtons
                value={value}
                onValueChange={onChange}
                buttons={[
                  { value: 'Light', label: 'Light' },
                  { value: 'System', label: 'System' },
                  { value: 'Dark', label: 'Dark' },
                ]}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="rating"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldSpacing}>
              <Text style={styles.label}>Mood Rating: {Math.round(value)}/10</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.surfaceVariant}
                value={value}
                onValueChange={onChange}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="profile_photo_uri"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldSpacing}>
              <Text style={styles.label}>Profile Photo</Text>
              <View style={styles.row}>
                {value ? (
                  <Avatar.Image size={64} source={{ uri: value }} />
                ) : (
                  <Avatar.Icon size={64} icon="camera" />
                )}
                <Button mode="outlined" onPress={() => pickImage(onChange)} style={{ marginLeft: 16 }}>
                  Select Photo
                </Button>
              </View>
            </View>
          )}
        />

        <Controller
          control={control}
          rules={{ required: 'Bio is required', maxLength: { value: 200, message: 'Max 200 chars' } }}
          name="bio"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                label="Bio"
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
                error={!!errors.bio}
              />
              {errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}
            </View>
          )}
        />

        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
          Submit
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}>
        Form submitted successfully!
      </Snackbar>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fieldSpacing: {
    paddingVertical: 8,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});
