import React from 'react'
import range from 'lodash/range.js'
import shuffle from 'lodash/shuffle.js'
import { graphql, useStaticQuery } from 'gatsby'
import {
    ResponsiveBump,
    bumpSvgDefaultProps as defaults,
    BumpCommonProps,
    DefaultBumpDatum,
    isBumpPoint,
    isComputedBumpSerie,
} from '@nivo/bump'
import { MotionProps } from '@nivo/core'
import { AxisProps } from '@nivo/axes'
import { ComponentTemplate } from '../../components/components/ComponentTemplate'
import meta from '../../data/components/bump/meta.yml'
import { groups } from '../../data/components/bump/props'
import mapper from '../../data/components/bump/mapper'

const generateData = () => {
    const years = range(2000, 2005)
    const ranks = range(1, 13)

    const series: {
        id: string
        data: DefaultBumpDatum[]
    }[] = ranks.map(rank => {
        return {
            id: `Serie ${rank}`,
            data: [],
        }
    })

    years.forEach(year => {
        shuffle(ranks).forEach((rank, i) => {
            series[i].data.push({
                x: year.toString(),
                y: rank,
            })
        })
    })

    return series
}

type Props = Omit<
    // eslint-disable-next-line @typescript-eslint/ban-types
    BumpCommonProps<DefaultBumpDatum, {}>,
    'theme' | 'onMouseEnter' | 'onMouseMove' | 'onMouseLeave' | 'onClick'
> &
    MotionProps

type UnmappedProps = Omit<
    Props,
    'axisTop' | 'axisRight' | 'axisBottom' | 'axisLeft' | 'renderWrapper'
> & {
    axisTop: AxisProps & { enable: boolean }
    axisRight: AxisProps & { enable: boolean }
    axisBottom: AxisProps & { enable: boolean }
    axisLeft: AxisProps & { enable: boolean }
}

const initialProperties: UnmappedProps = {
    ...defaults,
    margin: {
        top: 40,
        right: 100,
        bottom: 40,
        left: 60,
    },

    colors: { scheme: 'spectral' },
    lineWidth: 3,
    activeLineWidth: 6,
    inactiveLineWidth: 3,
    inactiveOpacity: 0.15,

    pointSize: 10,
    activePointSize: 16,
    inactivePointSize: 0,
    pointColor: { theme: 'background' },
    pointBorderWidth: 3,
    activePointBorderWidth: 3,
    inactivePointBorderWidth: 0,
    pointBorderColor: { from: 'serie.color' },

    axisTop: {
        enable: true,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: -36,
        truncateTickAt: 0,
    },
    axisRight: {
        enable: false,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: (value: number) => `#${value}`,
        legend: 'ranking',
        legendPosition: 'middle',
        legendOffset: 40,
        truncateTickAt: 0,
    },
    axisBottom: {
        enable: true,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 32,
        truncateTickAt: 0,
    },
    axisLeft: {
        enable: true,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: (value: number) => `#${value}`,
        legend: 'ranking',
        legendPosition: 'middle',
        legendOffset: -40,
        truncateTickAt: 0,
    },
}

const Bump = () => {
    const {
        image: {
            childImageSharp: { gatsbyImageData: image },
        },
    } = useStaticQuery(graphql`
        query {
            image: file(absolutePath: { glob: "**/src/assets/captures/bump.png" }) {
                childImageSharp {
                    gatsbyImageData(layout: FIXED, width: 700, quality: 100)
                }
            }
        }
    `)

    return (
        <ComponentTemplate<UnmappedProps, Props>
            name="Bump"
            meta={meta.Bump}
            icon="chord"
            flavors={meta.flavors}
            currentFlavor="svg"
            properties={groups}
            defaultProperties={defaults}
            initialProperties={initialProperties}
            propertiesMapper={mapper}
            generateData={generateData}
            image={image}
        >
            {(properties, data, theme, logAction) => {
                return (
                    <ResponsiveBump
                        data={data}
                        {...properties}
                        theme={theme}
                        onClick={(data: any) => {
                            if (isComputedBumpSerie(data)) {
                                logAction({
                                    type: 'click',
                                    label: `[serie] ${data.id}`,
                                    color: data.color,
                                    data: data,
                                })
                            } else if (isBumpPoint(data)) {
                                logAction({
                                    type: 'click',
                                    label: `[point] x: ${data.data.x}, y: ${data.data.y} (series: ${data.serie.id})`,
                                    color: data.serie.color,
                                    data: data,
                                })
                            }
                        }}
                    />
                )
            }}
        </ComponentTemplate>
    )
}

export default Bump
