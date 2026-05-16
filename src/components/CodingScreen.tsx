import { useState } from 'react';
import { Brain, Play, Send, ChevronDown, CheckCircle2, XCircle, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++'];

const STARTER_CODE: Record<string, string> = {
  JavaScript: `/**
 * Two Sum
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  Python: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
  Java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
  'C++': `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
};

const TEST_RESULTS = [
  { label: 'Test Case 1', input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', output: '[0,1]', pass: true },
  { label: 'Test Case 2', input: 'nums = [3,2,4], target = 6', expected: '[1,2]', output: '[1,2]', pass: true },
  { label: 'Test Case 3', input: 'nums = [3,3], target = 6', expected: '[0,1]', output: '[0,1]', pass: true },
];

type RunState = 'idle' | 'running' | 'done';
type SubmitState = 'idle' | 'loading' | 'done';

function LineNumbers({ code }: { code: string }) {
  const lines = code.split('\n').length;
  return (
    <div className="select-none text-right pr-3 text-gray-600 text-xs font-mono leading-6 border-r border-white/10 min-w-[36px]">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

export default function CodingScreen() {
  const { setCurrentScreen, stopCamera } = useApp();
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState(STARTER_CODE['JavaScript']);
  const [runState, setRunState] = useState<RunState>('idle');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang]);
    setRunState('idle');
  };

  const handleRun = () => {
    setRunState('running');
    setTimeout(() => setRunState('done'), 1500);
  };

  const handleSubmit = () => {
    setSubmitState('loading');
    stopCamera()
    setTimeout(() => {
      setSubmitState('done');
      setTimeout(() => setCurrentScreen(6), 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col animate-fade-in">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-blue-500 rounded-lg w-7 h-7">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white">HireIQ</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs text-gray-400 border rounded-full bg-white/5 border-white/10">
            Coding Challenge · Question 11 of 11
          </span>
          <span className="px-2 py-1 text-xs font-medium text-yellow-400 border rounded-full bg-yellow-500/20 border-yellow-500/30">
            Medium
          </span>
        </div>
      </nav>

      {/* Main split */}
      <main className="flex flex-col flex-1 overflow-auto lg:flex-row">
        {/* LEFT: Problem Statement */}
        <div className="w-full p-5 overflow-auto border-r lg:w-1/2 scrollbar-thin border-white/5">
          <div className="mb-4">
            <h1 className="mb-2 text-2xl font-bold text-white">Two Sum</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-medium">Medium</span>
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400">Arrays</span>
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400">Hash Table</span>
            </div>
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-gray-300">
            <p>
              Given an array of integers <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono">nums</code> and
              an integer <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono">target</code>,
              return <em>indices of the two numbers such that they add up to</em> <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono">target</code>.
            </p>
            <p>
              You may assume that each input would have <strong className="text-white">exactly one solution</strong>,
              and you may not use the same element twice. You can return the answer in any order.
            </p>

            {/* Example 1 */}
            <div className="p-4 font-mono text-xs border bg-white/5 border-white/10 rounded-xl">
              <p className="mb-2 font-sans text-sm font-semibold text-gray-400">Example 1</p>
              <p><span className="text-gray-500">Input: </span><span className="text-green-400">nums = [2,7,11,15], target = 9</span></p>
              <p><span className="text-gray-500">Output: </span><span className="text-blue-400">[0,1]</span></p>
              <p className="mt-1 text-gray-500">// Because nums[0] + nums[1] == 9, return [0, 1].</p>
            </div>

            {/* Example 2 */}
            <div className="p-4 font-mono text-xs border bg-white/5 border-white/10 rounded-xl">
              <p className="mb-2 font-sans text-sm font-semibold text-gray-400">Example 2</p>
              <p><span className="text-gray-500">Input: </span><span className="text-green-400">nums = [3,2,4], target = 6</span></p>
              <p><span className="text-gray-500">Output: </span><span className="text-blue-400">[1,2]</span></p>
            </div>

            {/* Example 3 */}
            <div className="p-4 font-mono text-xs border bg-white/5 border-white/10 rounded-xl">
              <p className="mb-2 font-sans text-sm font-semibold text-gray-400">Example 3</p>
              <p><span className="text-gray-500">Input: </span><span className="text-green-400">nums = [3,3], target = 6</span></p>
              <p><span className="text-gray-500">Output: </span><span className="text-blue-400">[0,1]</span></p>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-white">Constraints</h3>
              <ul className="space-y-1 font-mono text-xs text-gray-400">
                <li>· 2 &lt;= nums.length &lt;= 10<sup>4</sup></li>
                <li>· -10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
                <li>· -10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></li>
                <li>· Only one valid answer exists.</li>
              </ul>
            </div>

            <div className="p-3 text-xs text-blue-300 border bg-blue-500/10 border-blue-500/20 rounded-xl">
              <strong>Follow-up:</strong> Can you come up with an algorithm that is less than O(n²) time complexity?
            </div>
          </div>
        </div>

        {/* RIGHT: Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#0d1117]">
          {/* Editor top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="relative flex items-center gap-1">
              <select
                value={language}
                onChange={e => handleLanguageChange(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-white text-xs px-3 py-1.5 pr-7 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#0d1117]">{l}</option>)}
              </select>
              <ChevronDown className="absolute w-3 h-3 text-gray-400 pointer-events-none right-2" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={runState === 'running'}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-60"
              >
                {runState === 'running' ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitState !== 'idle'}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-60"
              >
                {submitState === 'loading' ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {submitState === 'loading' ? 'Submitting...' : submitState === 'done' ? 'Submitted!' : 'Submit Code'}
              </button>
            </div>
          </div>

          {/* Code area */}
          <div className="flex flex-1 overflow-auto" style={{ minHeight: '300px' }}>
            <div className="flex w-full pt-3 font-mono text-xs leading-6">
              <LineNumbers code={code} />
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full pl-4 pr-4 leading-6 text-gray-200 bg-transparent resize-none focus:outline-none scrollbar-thin"
                style={{ fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace" }}
              />
            </div>
          </div>

          {/* Output panel */}
          {(runState === 'done' || runState === 'running') && (
            <div className="border-t border-white/10 bg-[#0A0F1E] p-4 max-h-48 overflow-auto">
              <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">Test Results</p>
              {runState === 'running' ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader className="w-4 h-4 text-blue-400 animate-spin" />
                  Running test cases...
                </div>
              ) : (
                <div className="space-y-2">
                  {TEST_RESULTS.map(tc => (
                    <div key={tc.label} className={`flex items-center justify-between p-2.5 rounded-lg text-xs border ${tc.pass ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="flex items-center gap-2">
                        {tc.pass
                          ? <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-emerald-400" />
                          : <XCircle className="flex-shrink-0 w-4 h-4 text-red-400" />}
                        <span className="font-semibold text-white">{tc.label}</span>
                        <span className="hidden text-gray-500 sm:inline">· {tc.input}</span>
                      </div>
                      <span className={`font-mono font-semibold ${tc.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tc.output} {tc.pass ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All {TEST_RESULTS.length} test cases passed · Runtime: 72ms · Memory: 42.8MB
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
