import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { ResponsiveMarimekko, defaultProps, BarDatum } from '@nivo/marimekko'
import { random, omit } from 'lodash'
import { ComponentTemplate } from '../../components/components/ComponentTemplate'
import meta from '../../data/components/marimekko/meta.yml'
import mapper, {
    UnmappedMarimekkoProps,
    MappedMarimekkoProps,
} from '../../data/components/marimekko/mapper'
import { groups } from '../../data/components/marimekko/props'

const getRandomValue = () => random(0, 32)

const generateData = () =>
    [`it's good`, `it's sweet`, `it's spicy`, 'worth eating', 'worth buying'].map(statement => ({
        statement,
        participation: getRandomValue(),
        stronglyAgree: getRandomValue(),
        agree: getRandomValue(),
        disagree: getRandomValue(),
        stronglyDisagree: getRandomValue(),
    }))

const initialProperties: UnmappedMarimekkoProps = {
    id: 'statement',
    value: 'participation',
    dimensions: [
        {
            id: 'disagree strongly',
            value: 'stronglyDisagree',
        },
        {
            id: 'disagree',
            value: 'disagree',
        },
        {
            id: 'agree',
            value: 'agree',
        },
        {
            id: 'agree strongly',
            value: 'stronglyAgree',
        },
    ],
    layout: defaultProps.layout,
    offset: defaultProps.offset,
    outerPadding: defaultProps.outerPadding,
    innerPadding: 9,

    axisTop: {
        enable: false,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendOffset: 36,
        truncateTickAt: 0,
    },
    axisRight: {
        enable: true,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendOffset: 0,
        truncateTickAt: 0,
    },
    axisBottom: {
        enable: true,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'participation',
        legendOffset: 36,
        legendPosition: 'middle',
        truncateTickAt: 0,
    },
    axisLeft: {
        enable: true,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'opinions',
        legendOffset: -40,
        legendPosition: 'middle',
        truncateTickAt: 0,
    },
    enableGridX: defaultProps.enableGridX,
    enableGridY: defaultProps.enableGridY,

    margin: {
        top: 40,
        right: 80,
        bottom: 100,
        left: 80,
    },

    valueFormat: { format: '', enabled: false },

    colors: { scheme: 'spectral' },

    borderWidth: 1,
    borderColor: {
        from: 'color',
        modifiers: [['darker', 0.2]],
    },

    isInteractive: true,
    'custom tooltip example': false,
    'showcase pattern usage': true,

    defs: [],
    fill: [],

    animate: defaultProps.animate,
    motionConfig: defaultProps.motionConfig,

    legends: [
        {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 80,
            itemsSpacing: 0,
            itemWidth: 140,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'right-to-left',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'square',
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemTextColor: '#000',
                    },
                },
            ],
        },
    ],
}

const Marimekko = () => {
    const {
        image: {
            childImageSharp: { gatsbyImageData: image },
        },
    } = useStaticQuery(graphql`
        query {
            image: file(absolutePath: { glob: "**/src/assets/captures/marimekko.png" }) {
                childImageSharp {
                    gatsbyImageData(layout: FIXED, width: 700, quality: 100)
                }
            }
        }
    `)

    return (
        <ComponentTemplate<UnmappedMarimekkoProps, MappedMarimekkoProps, readonly any[]>
            name="Marimekko"
            meta={meta.Marimekko}
            icon="marimekko"
            flavors={meta.flavors}
            currentFlavor="svg"
            properties={groups}
            initialProperties={initialProperties}
            defaultProperties={defaultProps}
            propertiesMapper={mapper}
            generateData={generateData}
            image={image}
        >
            {(properties, data, theme, logAction) => {
                const handleClick = (bar: BarDatum<any>) => {
                    logAction({
                        type: 'click',
                        label: `[bar] ${bar.datum.id} - ${bar.id}: ${bar.value}`,
                        color: bar.color,
                        // prevent cyclic dependency
                        data: {
                            ...omit(bar, ['datum']),
                            datum: omit(bar.datum, ['dimensions']),
                        },
                    })
                }

                return (
                    <ResponsiveMarimekko
                        data={data}
                        {...properties}
                        theme={theme}
                        onClick={handleClick}
                        legends={properties.legends!.map(legend => ({
                            ...legend,
                        }))}
                    />
                )
            }}
        </ComponentTemplate>
    )
}

export default Marimekko
