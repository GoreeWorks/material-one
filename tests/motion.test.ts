import test from "node:test";
import assert from "node:assert/strict";
import { createMaterialOneContext } from "../packages/core/src/index.ts";
import { createAccessibilityPolicy } from "../packages/accessibility/src/index.ts";
import {
  createAdaptiveMotionPresentation,
  createMotionPolicy,
  createMotionPresentation,
  resolveAdaptiveMotionRecipe
} from "../packages/motion/src/index.ts";

function context(motion:"full"|"reduced"|"none"="full"){
  return createMaterialOneContext(
    {theme:"system",density:"comfortable",motion,experienceMode:"professional"},
    {width:900,height:900,input:"mixed",orientation:"landscape"}
  );
}

test("motion policy uses Accessibility effective motion",()=>{
  const ctx=context("full");
  const a11y=createAccessibilityPolicy(ctx,{prefersReducedMotion:true});
  const policy=createMotionPolicy(ctx,a11y);
  assert.equal(policy.requested,"full");
  assert.equal(policy.effective,"reduced");
  assert.equal(policy.constrainedByAccessibility,true);
});

test("adaptive decorative motion is removed under effective reduced motion",()=>{
  const ctx=context("full");
  const a11y=createAccessibilityPolicy(ctx,{prefersReducedMotion:true});
  const recipe=resolveAdaptiveMotionRecipe(ctx,a11y,"navigation");
  assert.equal(recipe.durationMs,0);
  assert.equal(recipe.translatePx,0);
  assert.equal(recipe.scaleFrom,1);
});

test("adaptive essential feedback remains short under reduced motion",()=>{
  const ctx=context("full");
  const a11y=createAccessibilityPolicy(ctx,{prefersReducedMotion:true});
  const recipe=resolveAdaptiveMotionRecipe(ctx,a11y,"feedback");
  assert.ok(recipe.durationMs>0);
  assert.ok(recipe.durationMs<=100);
});

test("adaptive motion presentation exposes requested and effective policy",()=>{
  const ctx=context("full");
  const a11y=createAccessibilityPolicy(ctx,{prefersReducedMotion:true});
  const p=createAdaptiveMotionPresentation(ctx,a11y,"enter");
  assert.equal(p.attributes["data-mo-motion"],"reduced");
  assert.equal(p.attributes["data-mo-motion-requested"],"full");
  assert.equal(p.attributes["data-mo-motion-constrained"],"true");
  assert.equal(p.attributes["data-mo-motion-active"],"false");
  assert.equal(p.style["--mo-motion-duration"],"0ms");
});

test("explicit motion presentation remains available for low-level consumers",()=>{
  const p=createMotionPresentation("feedback","full");
  assert.equal(p.attributes["data-mo-motion-intent"],"feedback");
  assert.equal(p.attributes["data-mo-motion"],"full");
  assert.equal(p.attributes["data-mo-motion-essential"],"true");
  assert.equal(p.style["--mo-motion-duration"],"160ms");
});
