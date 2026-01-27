import { IconSymbol } from '@/components/ui/icon-symbol';
import { APP_CONFIG, LANGUAGES } from '@/constants/app-constants';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LanguageModalProps {
  t: (key: string) => string;
  activeColors: any;
  isVisible: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  t,
  activeColors,
  isVisible,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: activeColors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: activeColors.text }]}>{t('select_language')}</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark.circle.fill" size={24} color={activeColors.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.langList}>
            {LANGUAGES.map((item) => (
              <TouchableOpacity
                key={item.code}
                onPress={() => {
                  onSelectLanguage(item.code);
                  onClose();
                }}
                style={[
                  styles.langItem,
                  currentLanguage === item.code && { backgroundColor: activeColors.primary + APP_CONFIG.PULSE_OPACITY }
                ]}
              >
                <View style={styles.langInfo}>
                  <Text style={[styles.langNative, { color: activeColors.text }]}>{item.native}</Text>
                  <Text style={[styles.langLabel, { color: activeColors.icon }]}>{item.label}</Text>
                </View>
                {currentLanguage === item.code && (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={activeColors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  langList: {
    gap: 12,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  langInfo: {
    flexDirection: 'column',
  },
  langNative: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  langLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});
