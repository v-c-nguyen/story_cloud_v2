export interface pathwayInterface {
    id: number,
    name: string,
    description: string,
    length: number,
    created: Date,
    children: Array<any>,
    categories: Array<string>
}


export const pathwayData = [
    {
        id: 1,
        name: 'Sockial & Empathy Lessons',
        description: "The learning product region is perhaps the most important region of the parent mode, where immersive educational content is organized into interactive Pathways. The learning product region is perhaps the most important region of the parent mode.",
        length: 45,
        created: '24:12:24',
        children: [
            'Mia',
            'Jesse'
        ],
        categories: ['Numeracy & Problem Solving']
    },
    {
        id: 2,
        name: 'Sockial & Empathy Lessons',
        description: "The learning product region is perhaps the most important region of the parent mode, where immersive educational content is organized into interactive Pathways. The learning product region is perhaps the most important region of the parent mode.",
        length: 45,
        created: '24:12:24',
        children: [
            'Mia',
            'Jesse'
        ],
        categories: ['Numeracy & Problem Solving']
    }
]
