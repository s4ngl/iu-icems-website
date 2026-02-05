#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Scaffold Generator for ICEMS Website
 * Creates the directory structure and empty files based on the project tree
 */

// Type definitions
type FileStructure = {
  [key: string]: FileStructure | null;
};

// Files and folders to ignore
const IGNORE_LIST: readonly string[] = [
  '.github',
  '.husky',
  'components',
  '.env.local.example',
  '.env.production',
  '.eslintrc.json',
  '.prettierrc',
  '.gitignore',
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'package.json',
  'postcss.config.js',
  'components.json',
  'README.md'
] as const;

// Project structure
const PROJECT_STRUCTURE: FileStructure = {
  'public': {
    'images': {
      'logo.svg': null,
      'hero': {},
      'services': {},
      'team': {}
    },
    'icons': {
      'favicon.ico': null,
      'icon-192.png': null,
      'icon-512.png': null
    },
    'fonts': {},
    'manifest.json': null
  },
  'src': {
    'app': {
      '(auth)': {
        'login': {
          'page.tsx': null
        },
        'register': {
          'page.tsx': null
        },
        'forgot-password': {
          'page.tsx': null
        },
        'reset-password': {
          'page.tsx': null
        },
        'layout.tsx': null
      },
      '(public)': {
        'page.tsx': null,
        'about': {
          'page.tsx': null
        },
        'services': {
          'page.tsx': null
        },
        'join': {
          'page.tsx': null
        },
        'layout.tsx': null
      },
      '(member)': {
        'dashboard': {
          'page.tsx': null,
          '_components': {
            'StatsWidget.tsx': null,
            'UpcomingAssignments.tsx': null,
            'RecentEvents.tsx': null,
            'ActionItems.tsx': null,
            'QuickCalendar.tsx': null
          }
        },
        'calendar': {
          'page.tsx': null,
          '_components': {
            'CalendarView.tsx': null,
            'MonthView.tsx': null,
            'WeekView.tsx': null,
            'EventPopup.tsx': null,
            'CalendarFilters.tsx': null
          }
        },
        'events': {
          'page.tsx': null,
          '[eventId]': {
            'page.tsx': null,
            '_components': {
              'EventDetails.tsx': null,
              'SignupButton.tsx': null,
              'WaitlistStatus.tsx': null,
              'AssignedMembers.tsx': null
            }
          },
          '_components': {
            'EventsList.tsx': null,
            'EventCard.tsx': null,
            'EventFilters.tsx': null,
            'EventCalendarToggle.tsx': null
          }
        },
        'training': {
          'page.tsx': null,
          '[trainingId]': {
            'page.tsx': null
          },
          '_components': {
            'TrainingList.tsx': null,
            'TrainingCard.tsx': null,
            'AHATrainingSignup.tsx': null,
            'GeneralTrainingSignup.tsx': null
          }
        },
        'profile': {
          'page.tsx': null,
          '_components': {
            'PersonalInfo.tsx': null,
            'CertificationStatus.tsx': null,
            'HoursSummary.tsx': null,
            'PenaltyPoints.tsx': null,
            'DuesStatus.tsx': null,
            'EmergencyContacts.tsx': null,
            'PasswordChange.tsx': null
          }
        },
        'resources': {
          'page.tsx': null
        },
        'layout.tsx': null
      },
      '(supervisor)': {
        'assigned-events': {
          'page.tsx': null,
          '[eventId]': {
            'page.tsx': null,
            '_components': {
              'AssignedMembersList.tsx': null,
              'HoursConfirmation.tsx': null,
              'ContactInfo.tsx': null
            }
          }
        },
        'layout.tsx': null
      },
      '(board)': {
        'manage-members': {
          'page.tsx': null,
          '[memberId]': {
            'page.tsx': null,
            '_components': {
              'MemberProfile.tsx': null,
              'CertificationApproval.tsx': null,
              'DuesManagement.tsx': null,
              'PenaltyPointsManagement.tsx': null
            }
          },
          '_components': {
            'MembersTable.tsx': null,
            'MemberFilters.tsx': null,
            'PendingCertifications.tsx': null,
            'MemberSearch.tsx': null
          }
        },
        'manage-events': {
          'page.tsx': null,
          'create': {
            'page.tsx': null
          },
          '[eventId]': {
            'edit': {
              'page.tsx': null
            },
            'waitlist': {
              'page.tsx': null,
              '_components': {
                'WaitlistTable.tsx': null,
                'AssignmentControls.tsx': null,
                'MemberQuickView.tsx': null
              }
            },
            'page.tsx': null
          },
          '_components': {
            'EventForm.tsx': null,
            'EventsManagementTable.tsx': null,
            'EventNotifications.tsx': null
          }
        },
        'manage-training': {
          'page.tsx': null,
          'create': {
            'page.tsx': null
          },
          '[trainingId]': {
            'edit': {
              'page.tsx': null
            },
            'participants': {
              'page.tsx': null,
              '_components': {
                'ParticipantsList.tsx': null,
                'PaymentConfirmation.tsx': null
              }
            },
            'page.tsx': null
          },
          '_components': {
            'TrainingForm.tsx': null,
            'TrainingManagementTable.tsx': null
          }
        },
        'layout.tsx': null
      },
      'api': {
        'auth': {
          'register': {
            'route.ts': null
          },
          'login': {
            'route.ts': null
          },
          'logout': {
            'route.ts': null
          },
          'forgot-password': {
            'route.ts': null
          },
          'reset-password': {
            'route.ts': null
          },
          'change-password': {
            'route.ts': null
          },
          'session': {
            'route.ts': null
          }
        },
        'members': {
          'route.ts': null,
          'profile': {
            'route.ts': null
          },
          '[memberId]': {
            'route.ts': null,
            'dues': {
              'route.ts': null
            },
            'penalty-points': {
              'route.ts': null
            }
          }
        },
        'certifications': {
          'route.ts': null,
          'upload': {
            'route.ts': null
          },
          '[certId]': {
            'route.ts': null,
            'approve': {
              'route.ts': null
            }
          }
        },
        'events': {
          'route.ts': null,
          '[eventId]': {
            'route.ts': null,
            'signup': {
              'route.ts': null
            },
            'waitlist': {
              'route.ts': null
            },
            'assign': {
              'route.ts': null
            }
          }
        },
        'training': {
          'route.ts': null,
          '[trainingId]': {
            'route.ts': null,
            'signup': {
              'route.ts': null
            },
            'payment': {
              'route.ts': null
            }
          }
        },
        'calendar': {
          'route.ts': null,
          '[month]': {
            '[year]': {
              'route.ts': null
            }
          }
        },
        'penalty-points': {
          '[pointId]': {
            'route.ts': null
          }
        },
        'notifications': {
          'send': {
            'route.ts': null
          },
          'test': {
            'route.ts': null
          }
        }
      },
      'layout.tsx': null,
      'globals.css': null,
      'not-found.tsx': null,
      'error.tsx': null
    },
    'lib': {
      'supabase': {
        'client.ts': null,
        'server.ts': null,
        'middleware.ts': null,
        'storage.ts': null
      },
      'auth': {
        'session.ts': null,
        'permissions.ts': null,
        'password.ts': null,
        'tokens.ts': null
      },
      'email': {
        'client.ts': null,
        'templates': {
          'welcome.tsx': null,
          'event-assignment.tsx': null,
          'event-modification.tsx': null,
          'certification-expiration.tsx': null,
          'account-status.tsx': null
        },
        'sender.ts': null
      },
      'validation': {
        'schemas.ts': null,
        'validators.ts': null,
        'sanitizers.ts': null
      },
      'utils': {
        'cn.ts': null,
        'date.ts': null,
        'time.ts': null,
        'hours.ts': null,
        'file.ts': null,
        'format.ts': null,
        'constants.ts': null
      },
      'hooks': {
        'useAuth.ts': null,
        'useUser.ts': null,
        'useEvents.ts': null,
        'useTraining.ts': null,
        'useCertifications.ts': null,
        'useMembers.ts': null,
        'useCalendar.ts': null,
        'useDebounce.ts': null,
        'useMediaQuery.ts': null,
        'useToast.ts': null
      }
    },
    'types': {
      'database.types.ts': null,
      'auth.types.ts': null,
      'member.types.ts': null,
      'event.types.ts': null,
      'training.types.ts': null,
      'certification.types.ts': null,
      'notification.types.ts': null,
      'api.types.ts': null
    },
    'services': {
      'memberService.ts': null,
      'eventService.ts': null,
      'trainingService.ts': null,
      'certificationService.ts': null,
      'notificationService.ts': null,
      'hoursService.ts': null,
      'penaltyService.ts': null,
      'calendarService.ts': null
    },
    'middleware.ts': null,
    'config': {
      'site.ts': null,
      'navigation.ts': null,
      'roles.ts': null
    }
  },
  'supabase': {
    'migrations': {
      '00001_create_members_table.sql': null,
      '00002_create_authentication_table.sql': null,
      '00003_create_emergency_contacts_table.sql': null,
      '00004_create_certifications_table.sql': null,
      '00005_create_events_table.sql': null,
      '00006_create_event_signups_table.sql': null,
      '00007_create_event_hours_table.sql': null,
      '00008_create_penalty_points_table.sql': null,
      '00009_create_training_sessions_table.sql': null,
      '00010_create_training_signups_table.sql': null,
      '00011_create_rls_policies.sql': null,
      '00012_create_indexes.sql': null,
      '00013_create_functions_and_triggers.sql': null
    },
    'seed.sql': null,
    'config.toml': null
  },
  'tests': {
    'unit': {
      'services': {},
      'utils': {},
      'validation': {}
    },
    'integration': {
      'api': {},
      'auth': {}
    },
    'e2e': {
      'auth.spec.ts': null,
      'events.spec.ts': null,
      'training.spec.ts': null,
      'members.spec.ts': null
    }
  },
  'docs': {
    'API.md': null,
    'SETUP.md': null,
    'DEPLOYMENT.md': null,
    'CONTRIBUTING.md': null,
    'DATABASE.md': null
  },
  'scripts': {
    'seed-database.ts': null,
    'generate-types.ts': null,
    'backup-database.ts': null,
    'migrate.ts': null
  }
};

/**
 * Check if a path should be ignored
 */
function shouldIgnore(itemName: string): boolean {
  return IGNORE_LIST.includes(itemName);
}

/**
 * Create directory structure recursively
 */
function createStructure(structure: FileStructure, basePath: string = ''): void {
  for (const [name, content] of Object.entries(structure)) {
    // Skip ignored items
    if (shouldIgnore(name)) {
      console.log(`⏭️  Skipping: ${name}`);
      continue;
    }

    const fullPath: string = path.join(basePath, name);

    if (content === null) {
      // Create file
      const dir: string = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, '');
      console.log(`📄 Created file: ${fullPath}`);
    } else if (typeof content === 'object') {
      // Create directory
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Created directory: ${fullPath}`);
      }
      // Recursively create nested structure
      createStructure(content, fullPath);
    }
  }
}

/**
 * Main scaffold function
 */
function scaffold(targetPath: string = '.'): void {
  console.log('🚀 Starting scaffold generation...\n');
  console.log(`📍 Scaffolding in: ${path.resolve(targetPath)}\n`);

  // Create the structure in the target path directly
  createStructure(PROJECT_STRUCTURE, targetPath);

  console.log('\n✅ Scaffold generation complete!');
  console.log(`\n📦 Project scaffolded in: ${path.resolve(targetPath)}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Add configuration files (.env, package.json, etc.)');
  console.log('   2. Install dependencies: npm install');
  console.log('   3. Set up Supabase connection');
  console.log('   4. Start development: npm run dev');
}

// Export for use as a module
export { scaffold, createStructure, PROJECT_STRUCTURE };
export type { FileStructure };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args: string[] = process.argv.slice(2);
  const targetPath: string = args[0] || '.';

  scaffold(targetPath);
}
