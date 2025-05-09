import { SVGProps, useMemo } from 'react'
import { useTransition, animated } from '@react-spring/web'
import { useMotionConfig } from '@nivo/core'
import { useTheme } from '@nivo/theming'
import { AnyScale, getScaleTicks } from '@nivo/scales'

export interface RadialGridProps {
    scale: AnyScale
    ticks?: number | number[]
    innerRadius: number
    outerRadius: number
}

export const RadialGrid = ({ scale, innerRadius, outerRadius }: RadialGridProps) => {
    const theme = useTheme()

    const angles = useMemo(() => {
        const values = getScaleTicks(scale)

        return values.map((angleValue, index) => ({
            id: index,
            angle: scale(angleValue) - 90,
        }))
    }, [scale])

    const { animate, config: springConfig } = useMotionConfig()
    const transition = useTransition<
        { id: number; angle: number },
        { angle: number; opacity: number }
    >(angles, {
        keys: item => item.id,
        initial: item => ({
            angle: item.angle,
            opacity: 1,
        }),
        from: item => ({
            angle: item.angle,
            opacity: 0,
        }),
        enter: item => ({
            angle: item.angle,
            opacity: 1,
        }),
        update: item => ({
            angle: item.angle,
            opacity: 1,
        }),
        leave: item => ({
            angle: item.angle,
            opacity: 0,
        }),
        config: springConfig,
        immediate: !animate,
    })

    return (
        <>
            {transition((style, angle) => (
                <animated.g
                    key={angle.id}
                    transform={style.angle.to(v => `rotate(${v})`)}
                    opacity={style.opacity}
                >
                    <line
                        x1={innerRadius}
                        x2={outerRadius}
                        {...(theme.grid.line as SVGProps<SVGLineElement>)}
                    />
                </animated.g>
            ))}
        </>
    )
}
