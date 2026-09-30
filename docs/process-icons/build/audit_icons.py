import re,glob,html,json,collections
KEY={'BlurXTerminator':['correct_only','sharpen_stars','adjust_halos','sharpen_nonstellar','auto_nonstellar_psf'],
 'NoiseXTerminator':['denoise','detail','iterations','denoise_color','enable_color_separation'],
 'StarXTerminator':['stars','unscreen','overlap'],
 'SCNR':['colorToRemove','protectionMethod','amount'],
 'LocalHistogramEqualization':['radius','slopeLimit','amount','circularKernel'],
 'HDRMultiscaleTransform':['numberOfLayers','numberOfIterations','toLightness','preserveHue','lightnessMask'],
 'MorphologicalTransformation':['operator','amount','selectionPoint','numberOfIterations'],
 'LRGBCombination':['mL','mc','noiseReduction'],
 'GeneralizedHyperbolicStretch':['stretchFactor','localIntensity','symmetryPoint','highlightProtection','shadowProtection','stretchChannel','clipType'],
 'SpectrophotometricColorCalibration':['whiteReferenceName','deviceQECurveName','redFilterName','greenFilterName','blueFilterName','neutralizeBackground','backgroundLow','backgroundHigh','backgroundUseROI','generateGraphs','narrowbandMode'],
 'SpectrophotometricFluxCalibration':['grayFilterName','redFilterName','deviceQECurveName','narrowbandMode','grayFilterWavelength','grayFilterBandwidth'],
 'MultiscaleGradientCorrection':['grayMARSFilter','gradientScale','structureSeparation','modelSmoothness','showGradientModel'],
 'DynamicBackgroundExtraction':['samplesPerRow','defaultSampleRadius','tolerance','shadowsRelaxation','smoothing','targetCorrection'],
 'NarrowbandNormalization':['palette','lightness','scnr','o3boost','s2boost'],
 'CosmeticCorrection':['useAutoDetect','hotAutoValue','coldAutoCheck'],
 'LinearFit':['referenceViewId','rejectHigh'],
 'GradientCorrection':[],'CurvesTransformation':[],'DynamicCrop':[],'Script':['filePath','md5sum'],'PixelMath':['expression','expression1','expression2','newImageId'],
}
out=collections.defaultdict(list)
for f in sorted(glob.glob('workflows/*.xpsm'))+sorted(glob.glob('0*.xpsm')):
    s=open(f).read()
    for m in re.finditer(r'<instance class="([^"]+)" version="[^"]+" id="([^"]+)_instance">(.*?)</instance>',s,re.S):
        cls,name,body=m.groups()
        p={}
        for pm in re.finditer(r'<parameter id="([^"]+)"(?: value="([^"]*)")?\s*/?>(?:([^<]*)</parameter>)?',body):
            p[pm.group(1)]=html.unescape(pm.group(2) if pm.group(2) is not None else (pm.group(3) or ''))
        d=re.search(r'<description>(.*?)</description>',body,re.S); d=html.unescape(d.group(1)) if d else ''
        sp=dict(re.findall(r'<td id="id">([^<]*)</td>\s*<td id="value">([^<]*)</td>',body))
        out[cls].append((f.split('/')[-1],name,{k:p.get(k) for k in KEY.get(cls,[])},sp,d))
json.dump(out,open('/tmp/claude-0/-home-user-cloud/693c782d-1903-5a32-81f5-99e602a627b3/scratchpad/icons_dump.json','w'),ensure_ascii=False)
for cls,items in sorted(out.items()):
    if cls in('NoOperation','PixelMath'): print(cls,len(items)); continue
    print('==',cls,len(items))
    seen=set()
    for f,n,p,sp,d in items:
        key=json.dumps(p,sort_keys=True)+json.dumps(sp,sort_keys=True)
        if key in seen: continue
        seen.add(key); print('  ',f[:14],n[:34],p, sp if sp else '')
