"use client"

import type React from "react"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import confetti from "canvas-confetti"
import type { CreateTypes } from "canvas-confetti"

import { Button } from "@/components/ui/button"

export interface ConfettiRef {
  fire: (options?: CreateTypes) => void
}

interface ConfettiProps {
  options?: CreateTypes
  className?: string
  onMouseEnter?: () => void
}

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>(
  ({ options, className = "", onMouseEnter }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const confettiInstance = useRef<CreateTypes | null>(null)

    useEffect(() => {
      if (canvasRef.current) {
        confettiInstance.current = confetti.create(canvasRef.current, {
          resize: true,
          useWorker: true,
        })
      }
      return () => {
        if (confettiInstance.current) {
          confettiInstance.current.reset()
        }
      }
    }, [])

    const fire = useCallback(
      (opts = {}) => {
        if (confettiInstance.current) {
          (confettiInstance.current as any)({
            ...options,
            ...opts,
          })
        }
      },
      [options]
    )

    useImperativeHandle(ref, () => ({
      fire,
    }))

    return (
      <canvas
        ref={canvasRef}
        className={className}
        onMouseEnter={onMouseEnter}
      />
    )
  }
)

Confetti.displayName = "Confetti"

interface ConfettiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options?: CreateTypes
  children?: React.ReactNode
}

export function ConfettiButton({
  options,
  children,
  ...props
}: ConfettiButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    confetti({
      ...options,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    })
    props.onClick?.(event)
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}