/**
 * settings panel implmented using tweakpane.js
 * Note: to make sure z-index works, add the component as the last child element
 */
import Tweakpane from 'tweakpane';

import React, { useRef, useEffect } from "react";
export default (props)=>{
   const {title = 'settings', defaultParams, setParams} = props;

   const panelContainer = useRef(null);
   const panelRef = useRef(null);
   //create the panel
   useEffect(()=>{
      console.log('create panel', panelContainer.current);  
      let panel = panelRef.current;
      panel = new Tweakpane({
         container:panelContainer.current,
         title} );
      panel
         .addInput({ view: defaultParams.view }, "view", {
           options: { ['2D']: 0, ['3D Surface']: 1, ['3D Volume']:2 },
           label: "view"
         })
         .on("change", value => {
            setParams((preParams) => ({...preParams, view:value}));
         });
      panel
      .addInput({ activeCellOnly: defaultParams.activeCellOnly }, "activeCellOnly", {
         label: "Active cells only"
      })
      .on("change", value => {
         setParams((preParams) => ({...preParams, activeCellOnly:value}));
      });
      panel.addInput({zScale:defaultParams.zScale}, "zScale", {label:'z Scale',step:5, min:5, max:30})
         .on('change', value=>{
            setParams((preParams) => ({...preParams, zScale:value}));
         })
      panel.addInput({ meshTopVisible: defaultParams.meshTopVisible }, "meshTopVisible", { label: "Mesh Top" })
         .on("change", value => {
            setParams((preParams) => ({...preParams, meshTopVisible:value}));
         });
      panel.addInput({ meshBottomVisible: defaultParams.meshBottomVisible }, "meshBottomVisible", { label: "Mesh Bottom/2D" })
         .on("change", value => {
            setParams((preParams) => ({...preParams, meshBottomVisible:value}));
         });
      panel.addInput({ borderFaceVisible: defaultParams.borderFaceVisible }, "borderFaceVisible", { label: "Border Face" })
       .on("change", value => {
         setParams((preParams) => ({...preParams, borderFaceVisible:value}));

       });
      const basmap = panel.addFolder({ title: "base map" });
      basmap
      .addInput({ visible: defaultParams.basemapVisible }, "visible", { label: "Visible" })
      .on("change", value => {
        setParams((preParams) => ({...preParams, basemapVisible:value}));
        //console.log(value);
      });
      //contour settings
      
    const contour = panel.addFolder({ title: "contour" });
    contour
      .addInput({ visible: defaultParams.contourVisible }, "visible", { label: "Visible" })
      .on("change", value => {
         setParams((preParams) => ({...preParams, contourVisible:value}));
   });
      contour
      .addInput({ isTop: defaultParams.isTop }, "isTop", { label: "top/bottom", options:{top:true, bottom:false} })
      .on("change", value => {
         setParams((preParams) => ({...preParams, isTop:value}));
      });
      contour
      .addInput({ isIsoband: defaultParams.isIsoband }, "isIsoband", { label: "Iso-line/band", options:{isoline:false, isoband:true} })
      .on("change", value => {
         setParams((preParams) => ({...preParams, isIsoband:value}));
      });
      contour
      .addInput({ contourCount: defaultParams.contourCount }, "contourCount", { label: "contour count", step:1, min:3, max:10 })
      .on("change", value => {
         setParams((preParams) => ({...preParams, contourCount:value}));
      });

      panel.expanded =false;
      return function(){
         panel.dispose();
      }
   }, [setParams])
   return <div ref={panelContainer} style={{ width: 256, zIndex:9, position: 'absolute',
      top: '5px', right: '10px'}}/>
}