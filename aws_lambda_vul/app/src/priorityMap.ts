export interface PriorityMapping {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        [key: string]: string;
      }
    }
  }
}

export const priorityMap = {
    active: {
      open: {
        superEffective: {
          veryHigh: 'Immediate',
          high: 'Immediate',
          medium: 'Out-of-Cycle',
          low: 'Out-of-Cycle'
        },
        efficient: {
          veryHigh: 'Immediate',
          high: 'Immediate',
          medium: 'Out-of-Cycle',
          low: 'Scheduled'
        },
        laborious: {
          veryHigh: 'Immediate',
          high: 'Out-of-Cycle',
          medium: 'Scheduled',
          low: 'Scheduled'
        }
      },
      controlled: {
        superEffective: {
          veryHigh: 'Out-of-Cycle',
          high: 'Out-of-Cycle',
          medium: 'Out-of-Cycle',
          low: 'Scheduled'
        },
        efficient: {
          veryHigh: 'Out-of-Cycle',
          high: 'Out-of-Cycle',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        laborious: {
          veryHigh: 'Out-of-Cycle',
          high: 'Out-of-Cycle',
          medium: 'Scheduled',
          low: 'Scheduled'
        }
      },
      small: {
        superEffective: {
          veryHigh: 'Out-of-Cycle',
          high: 'Out-of-Cycle',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        efficient: {
          veryHigh: 'Out-of-Cycle',
          high: 'Out-of-Cycle',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        laborious: {
          veryHigh: 'Out-of-Cycle',
          high: 'Out-of-Cycle',
          medium: 'Scheduled',
          low: 'Scheduled'
        }
      }
    },
    poc: {
      open: {
        superEffective: {
          veryHigh: 'Out-of-Cycle',
          high: 'Out-of-Cycle',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        efficient: {
          veryHigh: 'Out-of-Cycle',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        laborious: {
          veryHigh: 'Out-of-Cycle',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        }
      },
      controlled: {
        superEffective: {
          veryHigh: 'Out-of-Cycle',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        efficient: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        laborious: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        }
      },
      small: {
        superEffective: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        efficient: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        },
        laborious: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        }
      }
    },
    none: {
      open: {
        superEffective: {
          veryHigh: 'Out-of-Cycle',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        efficient: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        laborious: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        }
      },
      controlled: {
        superEffective: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'Scheduled'
        },
        efficient: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        },
        laborious: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        }
      },
      small: {
        superEffective: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        },
        efficient: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'Scheduled',
          low: 'defer'
        },
        laborious: {
          veryHigh: 'Scheduled',
          high: 'Scheduled',
          medium: 'defer',
          low: 'defer'
        }
      }
    }
  };
  