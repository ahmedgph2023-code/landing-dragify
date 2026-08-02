import React from "react";
import Image from "next/image";
import ReactFlow, { BaseEdge, EdgeProps, getSmoothStepPath, Handle, HandleProps, NodeProps, Position, useEdgesState, useNodesState } from "reactflow";
import 'reactflow/dist/style.css';
import { useLocalization } from '../context/LocalizationContext';

let timeoutIds: any[] = [];
const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

export function Workflow() {
   const { t, isRTL, language } = useLocalization();
   const flowRef = React.useRef<HTMLDivElement>(null);
   const [workflowIsLoad, setWorkflowIsLoad] = React.useState(false);
   
   // Adjust positions for RTL layout
   const getPosition = (x: number, y: number) => ({
      x: isRTL ? (x === 81 ? 90 : -x) : x,
      y
   });
   
   const createNodes = () => [
      { 
         type: 'customNode', id: '1', position: getPosition(81, -540), 
         data: { label: t('workflow.trigger'), isTrigger: true, handles: [{ type: 'source', position: Position.Bottom }], t }
      },
      { 
         type: 'customNode', id: '2', position: getPosition(0, -390), 
         data: { label: t('workflow.agents.ceo.title'), description: t('workflow.agents.ceo.description'), image: '/ceo.png', isTrigger: false, handles: [{ type: 'target', position: Position.Top }, { type: 'source', position: Position.Bottom }], t }
      },
      {    
         type: 'customNode', id: '3', position: getPosition(0, -130), 
         data: { label: t('workflow.agents.operations.title'), description: t('workflow.agents.operations.description'), image: '/oa.png', isTrigger: false, handles: [{ type: 'target', position: Position.Top }, { type: 'source', position: Position.Bottom }], t }
      },
      { type: 'customNode', id: '4', position: getPosition(-400, 170), data: { label: t('workflow.agents.customer.title'), description: t('workflow.agents.customer.description'), image: '/ca.png', isTrigger: false, handles: [{ type: 'target', position: Position.Top }], t }},
      { type: 'customNode', id: '5', position: getPosition(0, 170), data: { label: t('workflow.agents.product.title'), description: t('workflow.agents.product.description'), image: '/pa.png', isTrigger: false, handles: [{ type: 'target', position: Position.Top }], t }},
      { type: 'customNode', id: '6', position: getPosition(400, 170), data: { label: t('workflow.agents.marketing.title'), description: t('workflow.agents.marketing.description'), image: '/ma.png', isTrigger: false, handles: [{ type: 'target', position: Position.Top }], t }}
   ];

   const [nodes, setNodes, onNodesChange] = useNodesState<{
      label: string;
      description?: string;
      image?: string;
      isTrigger: boolean;
      handles: { type: string; position: Position; }[];
      t: (key: string) => any;
   }>(createNodes());
   const [edges, setEdges, onEdgesChange] = useEdgesState([
      { type: 'customEdge', id: 'e1-2', source: '1', target: '2', animated: false }, 
      { type: 'customEdge', id: 'e2-3', source: '2', target: '3', animated: false },
      { type: 'customEdge', id: 'e3-4', source: '3', target: '4', animated: false },
      { type: 'customEdge', id: 'e3-5', source: '3', target: '5', animated: false },
      { type: 'customEdge', id: 'e3-6', source: '3', target: '6', animated: false },
   ]);

   // Update nodes when language changes
   React.useEffect(() => {
      setNodes(() => createNodes());
   }, [language, isRTL, t]);

   React.useEffect(() => {
      if (workflowIsLoad) startLoop();
      return () => { timeoutIds.forEach(clearTimeout);  timeoutIds = []; }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [workflowIsLoad]);
   
   // Auto-trigger workflow load after component mounts
   React.useEffect(() => {
      const timer = setTimeout(() => {
         setWorkflowIsLoad(true);
      }, 1000);
      return () => clearTimeout(timer);
   }, []);

   const startLoop = () => {
      const { current: flow } = flowRef;
      setEdges(edges => edges.map(edge => ({ ...edge, animated: false })));
      for (let i = 2; i <= 6; i++) flow?.querySelector(`#node-${i}`)?.querySelector('.apps')?.classList.remove('start');
      // Clear any previous timeouts
      timeoutIds.forEach(clearTimeout);
      timeoutIds = [];

      const node1 = flow?.querySelector('#node-1');
      if (flow && node1) {
         timeoutIds.push(setTimeout(() => {
            node1.querySelector('.animated')?.classList.add('start');

            timeoutIds.push(setTimeout(() => {
               node1.querySelector('.animated')?.classList.remove('start');
               setEdges(edges => edges.map(edge => ({
                  ...edge,
                  animated: edge.animated || edge.id === 'e1-2',
               })));
               const node2 = flow.querySelector('#node-2');
               node2?.querySelector('.animated')?.classList.add('start');
               node2?.querySelector('.apps')?.classList.add('start');

               timeoutIds.push(setTimeout(() => {
                  node2?.querySelector('.animated')?.classList.remove('start');
                  setEdges(edges => edges.map(edge => ({
                     ...edge,
                     animated: edge.animated || edge.id === 'e2-3',
                  })));
                  const node3 = flow.querySelector('#node-3');
                  node3?.querySelector('.animated')?.classList.add('start');
                  node3?.querySelector('.apps')?.classList.add('start');

                  timeoutIds.push(setTimeout(() => {
                     node3?.querySelector('.animated')?.classList.remove('start');
                     setEdges(edges => edges.map(edge => ({ ...edge, animated: true })));
                     const node4 = flow.querySelector('#node-4');
                     const node5 = flow.querySelector('#node-5');
                     const node6 = flow.querySelector('#node-6');

                     node4?.querySelector('.animated')?.classList.add('start');
                     node4?.querySelector('.apps')?.classList.add('start');
                     node5?.querySelector('.animated')?.classList.add('start');
                     node5?.querySelector('.apps')?.classList.add('start');
                     node6?.querySelector('.animated')?.classList.add('start');
                     node6?.querySelector('.apps')?.classList.add('start');

                     timeoutIds.push(setTimeout(() => {
                        node4?.querySelector('.animated')?.classList.remove('start');
                        node5?.querySelector('.animated')?.classList.remove('start');
                        node6?.querySelector('.animated')?.classList.remove('start');
                        // Loop again
                        startLoop();
                     }, 3000));
                  }, 3000));
               }, 3000));
            }, 3000));
         }, 500));
      }
   }
   
   return (
      <div dir={isRTL ? 'rtl' : 'ltr'} style={{ direction: isRTL ? 'rtl' : 'ltr', width: '100%', height: '100%' }}>
         <ReactFlow
            key={`${language}-${isRTL}`}
            ref={ flowRef }
            proOptions={{ hideAttribution: true }} 
            nodes={ nodes }
            edges={ edges }
            nodeTypes={ nodeTypes }
            onNodesChange={ onNodesChange }
            edgeTypes={ edgeTypes }
            edgesFocusable={ false }
            fitView
            onEdgesChange={ onEdgesChange }
            autoPanOnNodeDrag={ false }
            nodesConnectable={ false }
            zoomOnScroll={ false }
            zoomOnDoubleClick={ false }
            zoomOnPinch={ false }
            nodesDraggable={ false }
            panOnDrag={ false }

            style={{ width: '100%', height: '100%' }}
         />
      </div>
   );
}

function CustomNode(props: NodeProps<{ label: string, description: string, isTrigger: boolean, image: string, handles: HandleProps[], t: (key: string) => any }>) {
   // Remove duplicate useLocalization hook - use t function passed as prop
   
   return (
      <div id={`node-${props.id}`} className={`customNode ${props.data.isTrigger ? 'autoWidth' : ''}`}>
         <div className="animated">
            <div className="border-box-glow"></div>
            <div className="border-box"></div>
         </div>
         { props.data.isTrigger ? <div className="trigger">
            <Image src="/slack.png" alt="logo" width={ 35 } height={ 35 } />
            <h3>{ props.data.label }</h3>
         </div> : <>
            <div className="ai">
               <Image src="/ai.png" alt="logo" width={ 25 } height={ 25 } />
               <span>{ props.data.t('workflow.aiAgent') }</span>
            </div>
            <div className="info">
               <div className="logo">
                  <Image src={ props.data.image } alt="logo" width={ 65 } height={ 65 } />
               </div>
               <div>
                  <h3>{ props.data.label }</h3>
                  <span>{ props.data.description }</span>
               </div>
            </div>
            <div className="apps">
               <Image src="/slack.png" alt="logo" width={ 25 } height={ 25 } />
               <Image src="/outlook.png" alt="logo" width={ 25 } height={ 25 } />
               <Image src="/onedrive.png" alt="logo" width={ 25 } height={ 25 } />
               <Image src="/salesforce.png" alt="logo" width={ 25 } height={ 25 } />
            </div>
         </> }
         { props.data.handles.map((handle, index) => (
            <Handle key={ index.toString() } id={ index.toString() } type={ handle.type } position={ handle.position } />
         ))}
      </div>
   );
}

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
   const [edgePath] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
   return ( <BaseEdge id={ id } path={ edgePath } /> );
};