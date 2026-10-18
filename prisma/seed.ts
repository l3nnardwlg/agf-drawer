import { PrismaClient, ConnectorFamily, ConnectorGender } from '@prisma/client';

const prisma = new PrismaClient();

export const STANDARD_CONNECTORS = [
  // USB
  {
    name: 'USB-A',
    family: ConnectorFamily.USB,
    gender: ConnectorGender.MALE,
    aliases: ['USB Type-A', 'USB 2.0 A', 'USB 3.0 A'],
    protocols: ['USB 1.1', 'USB 2.0', 'USB 3.0', 'USB 3.2 Gen 1'],
  },
  {
    name: 'USB-B',
    family: ConnectorFamily.USB,
    gender: ConnectorGender.MALE,
    aliases: ['USB Type-B', 'Printer USB'],
    protocols: ['USB 1.1', 'USB 2.0', 'USB 3.0'],
  },
  {
    name: 'USB-C',
    family: ConnectorFamily.USB,
    gender: ConnectorGender.MALE,
    aliases: ['Type-C', 'USB Type-C'],
    protocols: ['USB 2.0', 'USB 3.2', 'USB4', 'Thunderbolt 3', 'Thunderbolt 4', 'USB-PD'],
  },
  {
    name: 'Mini-USB',
    family: ConnectorFamily.USB,
    gender: ConnectorGender.MALE,
    aliases: ['Mini-B', 'Mini USB-B'],
    protocols: ['USB 2.0'],
  },
  {
    name: 'Micro-USB',
    family: ConnectorFamily.USB,
    gender: ConnectorGender.MALE,
    aliases: ['Micro-B', 'Micro USB-B'],
    protocols: ['USB 2.0'],
  },
  {
    name: 'USB 3.0 Micro-B',
    family: ConnectorFamily.USB,
    gender: ConnectorGender.MALE,
    aliases: ['Micro-B SuperSpeed', 'USB3 Micro-B'],
    protocols: ['USB 3.0', 'USB 3.1 Gen 1'],
  },

  // Video
  {
    name: 'HDMI',
    family: ConnectorFamily.VIDEO,
    gender: ConnectorGender.MALE,
    aliases: ['HDMI Type A', 'Standard HDMI'],
    protocols: ['HDMI 1.4', 'HDMI 2.0', 'HDMI 2.1'],
  },
  {
    name: 'Mini-HDMI',
    family: ConnectorFamily.VIDEO,
    gender: ConnectorGender.MALE,
    aliases: ['HDMI Type C'],
    protocols: ['HDMI 1.4', 'HDMI 2.0'],
  },
  {
    name: 'Micro-HDMI',
    family: ConnectorFamily.VIDEO,
    gender: ConnectorGender.MALE,
    aliases: ['HDMI Type D'],
    protocols: ['HDMI 1.4', 'HDMI 2.0'],
  },
  {
    name: 'DisplayPort',
    family: ConnectorFamily.VIDEO,
    gender: ConnectorGender.MALE,
    aliases: ['DP', 'Full DisplayPort'],
    protocols: ['DP 1.2', 'DP 1.4', 'DP 2.0', 'DP 2.1'],
  },
  {
    name: 'Mini DisplayPort',
    family: ConnectorFamily.VIDEO,
    gender: ConnectorGender.MALE,
    aliases: ['mDP', 'Mini-DP'],
    protocols: ['DP 1.2', 'DP 1.4'],
  },
  {
    name: 'VGA',
    family: ConnectorFamily.VIDEO,
    gender: ConnectorGender.MALE,
    aliases: ['DE-15', 'HD-15', 'RGB'],
    protocols: ['Analog RGB'],
  },
  {
    name: 'DVI-D',
    family: ConnectorFamily.VIDEO,
    gender: ConnectorGender.MALE,
    aliases: ['DVI Digital', 'DVI-D Dual Link'],
    protocols: ['DVI Single Link', 'DVI Dual Link'],
  },
  {
    name: 'DVI-I',
    family: ConnectorFamily.VIDEO,
    gender: ConnectorGender.MALE,
    aliases: ['DVI Integrated'],
    protocols: ['DVI Analog & Digital'],
  },

  // Networking
  {
    name: 'RJ45',
    family: ConnectorFamily.NETWORKING,
    gender: ConnectorGender.MALE,
    aliases: ['8P8C', 'Ethernet', 'LAN'],
    protocols: ['10BASE-T', '100BASE-TX', '1000BASE-T', '10GBASE-T'],
  },
  {
    name: 'RJ11',
    family: ConnectorFamily.NETWORKING,
    gender: ConnectorGender.MALE,
    aliases: ['6P4C', 'DSL', 'Telephone'],
    protocols: ['POTS', 'DSL'],
  },
  {
    name: 'LC Fiber',
    family: ConnectorFamily.NETWORKING,
    gender: ConnectorGender.MALE,
    aliases: ['Lucent Connector', 'LC Duplex'],
    protocols: ['Single-mode', 'Multi-mode OM3/OM4'],
  },
  {
    name: 'SC Fiber',
    family: ConnectorFamily.NETWORKING,
    gender: ConnectorGender.MALE,
    aliases: ['Subscriber Connector', 'Standard Connector'],
    protocols: ['Single-mode', 'Multi-mode'],
  },
  {
    name: 'BNC',
    family: ConnectorFamily.NETWORKING,
    gender: ConnectorGender.MALE,
    aliases: ['Bayonet Neill-Concelman', 'Coax 75 Ohm', 'Coax 50 Ohm'],
    protocols: ['10BASE2', 'SDI', 'RF'],
  },
  {
    name: 'SMA',
    family: ConnectorFamily.NETWORKING,
    gender: ConnectorGender.MALE,
    aliases: ['SubMiniature A', 'RP-SMA'],
    protocols: ['WiFi RF', 'Antenna'],
  },

  // Audio
  {
    name: '3.5mm Jack',
    family: ConnectorFamily.AUDIO,
    gender: ConnectorGender.MALE,
    aliases: ['1/8 inch', 'AUX', 'Klinke 3.5mm', 'TRS', 'TRRS'],
    protocols: ['Analog Audio Stereo', 'Analog Headset'],
  },
  {
    name: '6.35mm Jack',
    family: ConnectorFamily.AUDIO,
    gender: ConnectorGender.MALE,
    aliases: ['1/4 inch', 'Gross Klinke', 'Guitar Jack'],
    protocols: ['Balanced TRS', 'Unbalanced TS'],
  },
  {
    name: 'RCA',
    family: ConnectorFamily.AUDIO,
    gender: ConnectorGender.MALE,
    aliases: ['Cinch', 'Phono'],
    protocols: ['Analog Line Level', 'S/PDIF Coaxial'],
  },
  {
    name: 'XLR',
    family: ConnectorFamily.AUDIO,
    gender: ConnectorGender.MALE,
    aliases: ['XLR 3-pin', 'Cannon'],
    protocols: ['Balanced Mic', 'AES/EBU', 'DMX'],
  },
  {
    name: 'TOSLINK',
    family: ConnectorFamily.AUDIO,
    gender: ConnectorGender.MALE,
    aliases: ['Optical Audio', 'ADAT', 'S/PDIF Optical'],
    protocols: ['S/PDIF', 'ADAT Lightpipe'],
  },
  {
    name: 'Speakon',
    family: ConnectorFamily.AUDIO,
    gender: ConnectorGender.MALE,
    aliases: ['Neutrik Speakon', 'NL4', 'NL2'],
    protocols: ['High Current Speaker Output'],
  },

  // Power
  {
    name: 'Schuko',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.MALE,
    aliases: ['CEE 7/4', 'Type F'],
    protocols: ['AC 230V 16A'],
  },
  {
    name: 'Europlug',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.MALE,
    aliases: ['CEE 7/16', 'Type C'],
    protocols: ['AC 230V 2.5A'],
  },
  {
    name: 'IEC C5',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.FEMALE,
    aliases: ['Mickey Mouse', 'Cloverleaf'],
    protocols: ['AC 250V 2.5A'],
  },
  {
    name: 'IEC C7',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.FEMALE,
    aliases: ['Figure 8', 'Euro 8'],
    protocols: ['AC 250V 2.5A'],
  },
  {
    name: 'IEC C13',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.FEMALE,
    aliases: ['Kaltgeraetebuchse', 'PC Power Cord'],
    protocols: ['AC 250V 10A'],
  },
  {
    name: 'IEC C14',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.MALE,
    aliases: ['Kaltgeraetestecker'],
    protocols: ['AC 250V 10A'],
  },
  {
    name: 'IEC C19',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.FEMALE,
    aliases: ['High-current IEC'],
    protocols: ['AC 250V 16A'],
  },
  {
    name: 'IEC C20',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.MALE,
    aliases: ['High-current IEC Inlet'],
    protocols: ['AC 250V 16A'],
  },
  {
    name: 'DC Barrel',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.MALE,
    aliases: ['5.5x2.1mm', '5.5x2.5mm', 'Hohlstecker'],
    protocols: ['DC Power (5V/9V/12V/19V/24V)'],
  },

  // Other / Internal
  {
    name: 'SATA',
    family: ConnectorFamily.INTERNAL,
    gender: ConnectorGender.MALE,
    aliases: ['Serial ATA Data'],
    protocols: ['SATA 1.5G', 'SATA 3G', 'SATA 6G'],
  },
  {
    name: 'eSATA',
    family: ConnectorFamily.INTERNAL,
    gender: ConnectorGender.MALE,
    aliases: ['External SATA'],
    protocols: ['eSATA 3G'],
  },
  {
    name: 'Molex',
    family: ConnectorFamily.POWER,
    gender: ConnectorGender.MALE,
    aliases: ['4-pin Molex', 'Peripheral Power'],
    protocols: ['12V / 5V DC'],
  },
  {
    name: 'JST',
    family: ConnectorFamily.INTERNAL,
    gender: ConnectorGender.MALE,
    aliases: ['JST-XH', 'JST-PH', 'JST-SM'],
    protocols: ['Internal Low Voltage Wire-to-Board'],
  },
  {
    name: 'Dupont',
    family: ConnectorFamily.INTERNAL,
    gender: ConnectorGender.MALE,
    aliases: ['0.1 inch Header', 'Jumper Wire', '2.54mm Pin Header'],
    protocols: ['Breadboard / Prototyping'],
  },
  {
    name: 'DB9',
    family: ConnectorFamily.SERIAL,
    gender: ConnectorGender.MALE,
    aliases: ['DE-9', 'RS-232', 'COM Port'],
    protocols: ['RS-232', 'RS-422', 'CAN Bus'],
  },
  {
    name: 'DB25',
    family: ConnectorFamily.SERIAL,
    gender: ConnectorGender.MALE,
    aliases: ['Parallel Port', 'D-Sub 25'],
    protocols: ['IEEE 1284', 'RS-232'],
  },
];

async function main() {
  console.log('Seeding standard connector catalog...');
  for (const conn of STANDARD_CONNECTORS) {
    const existing = await prisma.connector.findFirst({
      where: {
        workspaceId: null,
        name: conn.name,
      },
    });

    if (!existing) {
      await prisma.connector.create({
        data: {
          name: conn.name,
          family: conn.family,
          gender: conn.gender,
          aliases: conn.aliases,
          protocols: conn.protocols,
          isCustom: false,
          workspaceId: null,
        },
      });
    }
  }
  console.log(`Seeded ${STANDARD_CONNECTORS.length} standard connectors.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
