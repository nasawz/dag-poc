import { useEffect } from "react"

// export const gModelMap = new Map<string, ExperimentGraph>()
export const gModelMap = new Map<string, any>()

export const useExperimentGraph = (experimentId: number | string) => {
    const expId = experimentId.toString()
    let existedExperimentGraph = gModelMap.get(expId)
    // if (!existedExperimentGraph) {
    //   existedExperimentGraph = new ExperimentGraph(expId)
    //   gModelMap.set(expId, existedExperimentGraph)
    // }
    return existedExperimentGraph
}

export const useUnmountExperimentGraph = (experimentId: string) => {
    useEffect(() => {
        return () => {
            const existedExperimentGraph = gModelMap.get(experimentId)
            if (existedExperimentGraph) {
                existedExperimentGraph.dispose()
                gModelMap.delete(experimentId)
            }
        }
    }, [experimentId])
}