import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Filter, Plus } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ProspectFunnelChart from '../Charts/ProspectFunnelChart';
import { useAuth } from '../../contexts/AuthContext';
import {
  createProspectFunnel,
  deleteProspectFunnel,
  fetchProspectFunnel,
  updateProspectFunnel,
} from '../../services/firestoreService';
import { guardWrite } from '../../utils/readonlyGuard';

const SOURCES = ['All', 'Referral', 'Digital', 'Exhibition', 'Cold Call', 'Walk-in'];
const STATUSES = ['Interested', 'Shortlisted', 'CFT Done', 'Converted'];

const initialForm = {
  date: '2025-10-05',
  prospectName: '',
  company: '',
  zone: 'North',
  source: 'Referral',
  status: 'Interested',
  salesperson: '',
  contact: '',
};

const KPIProspectFunnel = ({ dateRange }) => {
  const { viewOnly } = useAuth();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [filterSource, setFilterSource] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);

    try {
      const data = await fetchProspectFunnel({
        from: dateRange.from,
        to: dateRange.to,
        source: filterSource,
      });
      setRecords(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load prospect funnel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // TODO: Replace manual dependency suppression with a query hook when Firestore reads are centralized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.from, dateRange.to, filterSource]);

  const funnel = useMemo(() => {
    const counts = { interested: 0, shortlisted: 0, cftDone: 0, converted: 0 };

    records.forEach((record) => {
      if (record.status === 'Interested') counts.interested += 1;
      if (record.status === 'Shortlisted') counts.shortlisted += 1;
      if (record.status === 'CFT Done') counts.cftDone += 1;
      if (record.status === 'Converted') counts.converted += 1;
    });

    return counts;
  }, [records]);

  const conversionRate = useMemo(() => {
    if (!funnel.interested) return 0;
    return Math.round((funnel.converted / funnel.interested) * 100);
  }, [funnel]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!guardWrite(viewOnly)) return;

    const payload = { ...form, createdAt: new Date().toISOString() };

    try {
      if (editingId) {
        await updateProspectFunnel(editingId, payload);
        toast.success('Prospect updated');
      } else {
        await createProspectFunnel(payload);
        toast.success('Prospect added');
      }

      setForm((prev) => ({ ...prev, prospectName: '', company: '', salesperson: '', contact: '' }));
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      date: record.date || initialForm.date,
      prospectName: record.prospectName || '',
      company: record.company || '',
      zone: record.zone || initialForm.zone,
      source: record.source || initialForm.source,
      status: record.status || initialForm.status,
      salesperson: record.salesperson || '',
      contact: record.contact || '',
    });
  };

  const handleDelete = async (id) => {
    if (!guardWrite(viewOnly)) return;
    if (!window.confirm('Delete this prospect entry?')) return;

    try {
      await deleteProspectFunnel(id);
      toast.success('Deleted');
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  return (
    <section className="glass-effect p-4">
      <div className="flex items-center justify-between cursor-pointer gap-4" onClick={() => setOpen((value) => !value)}>
        <div>
          <h3 className="text-sm font-semibold text-teal">KPI 1 · Interested Prospect Funnel</h3>
          <p className="text-[11px] text-white/60">Track all prospects showing interest and funnel conversion from Interested → Converted.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Filter size={14} className="text-teal" />
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="glass-input px-2 py-1 rounded text-xs focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source === 'All' ? 'All sources' : source}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-teal"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((value) => !value);
            }}
          >
            <span>{open ? 'Collapse' : 'Expand'}</span>
            <ChevronDown size={14} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-1 grid grid-cols-2 gap-3 text-xs">
              <div className="glass-effect px-3 py-2"><p className="text-white/60 text-[11px]">Total Interested</p><p className="text-lg font-semibold text-white">{funnel.interested}</p></div>
              <div className="glass-effect px-3 py-2"><p className="text-white/60 text-[11px]">Total Converted</p><p className="text-lg font-semibold text-emerald-300">{funnel.converted}</p></div>
              <div className="glass-effect px-3 py-2"><p className="text-white/60 text-[11px]">Interested → Converted</p><p className="text-lg font-semibold text-gold">{conversionRate}%</p></div>
              <div className="glass-effect px-3 py-2"><p className="text-white/60 text-[11px]">Records in period</p><p className="text-lg font-semibold text-white">{records.length}</p></div>
            </div>
            <div className="xl:col-span-2"><ProspectFunnelChart funnel={funnel} /></div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-1 glass-effect p-3 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-white/70">{editingId ? 'Edit Prospect' : 'Add Prospect'}</p>
                {viewOnly && <span className="text-[10px] text-amber-300">Read-only mode</span>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-2 text-[11px]">
                <Field label="Date" type="date" value={form.date} disabled={viewOnly} onChange={(value) => setForm((prev) => ({ ...prev, date: value }))} />
                <Field label="Prospect Name" value={form.prospectName} disabled={viewOnly} onChange={(value) => setForm((prev) => ({ ...prev, prospectName: value }))} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Company" value={form.company} disabled={viewOnly} onChange={(value) => setForm((prev) => ({ ...prev, company: value }))} />
                  <Field label="Zone" value={form.zone} disabled={viewOnly} onChange={(value) => setForm((prev) => ({ ...prev, zone: value }))} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SelectField label="Lead Source" value={form.source} disabled={viewOnly} options={SOURCES.filter((source) => source !== 'All')} onChange={(value) => setForm((prev) => ({ ...prev, source: value }))} />
                  <SelectField label="Status" value={form.status} disabled={viewOnly} options={STATUSES} onChange={(value) => setForm((prev) => ({ ...prev, status: value }))} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Salesperson" value={form.salesperson} disabled={viewOnly} onChange={(value) => setForm((prev) => ({ ...prev, salesperson: value }))} />
                  <Field label="Contact (optional)" value={form.contact} disabled={viewOnly} onChange={(value) => setForm((prev) => ({ ...prev, contact: value }))} />
                </div>

                <button type="submit" disabled={viewOnly} className="mt-2 w-full bg-teal hover:bg-teal/90 text-navy font-semibold py-1.5 rounded text-xs flex items-center justify-center gap-1 disabled:opacity-50">
                  <Plus size={14} />
                  {editingId ? 'Update Prospect' : 'Add Prospect'}
                </button>
              </form>
            </div>

            <div className="xl:col-span-3 overflow-x-auto text-[11px]">
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead className="text-white/60">
                  <tr>
                    <th className="text-left px-2 py-1">Date</th><th className="text-left px-2 py-1">Lead Source</th><th className="text-left px-2 py-1">Prospect Name</th><th className="text-left px-2 py-1">Company</th><th className="text-left px-2 py-1">Contact</th><th className="text-left px-2 py-1">Status</th><th className="text-left px-2 py-1">Salesperson</th><th className="text-right px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <EmptyRow message="Loading…" />}
                  {!loading && records.length === 0 && <EmptyRow message="No prospect data in this period. Use the form to add sample entries (disabled in View Only mode)." />}
                  {!loading && records.map((record) => (
                    <tr key={record.id} className="bg-white/5">
                      <td className="px-2 py-1">{record.date ? format(new Date(record.date), 'dd-MMM') : ''}</td>
                      <td className="px-2 py-1">{record.source}</td>
                      <td className="px-2 py-1">{record.prospectName}</td>
                      <td className="px-2 py-1">{record.company}</td>
                      <td className="px-2 py-1">{record.contact}</td>
                      <td className="px-2 py-1"><span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px]">{record.status}</span></td>
                      <td className="px-2 py-1">{record.salesperson}</td>
                      <td className="px-2 py-1 text-right space-x-1">
                        {!viewOnly && <><button type="button" className="text-teal hover:text-gold" onClick={() => handleEdit(record)}>Edit</button><button type="button" className="text-rose-300 hover:text-rose-400" onClick={() => handleDelete(record.id)}>Del</button></>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Field = ({ label, type = 'text', value, disabled, onChange }) => (
  <div>
    <label className="block text-teal/70 mb-1">{label}</label>
    <input type={type} className="w-full glass-input px-2 py-1 rounded focus:outline-none" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
  </div>
);

const SelectField = ({ label, value, disabled, options, onChange }) => (
  <div>
    <label className="block text-teal/70 mb-1">{label}</label>
    <select className="w-full glass-input px-2 py-1 rounded focus:outline-none" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

const EmptyRow = ({ message }) => (
  <tr>
    <td colSpan={8} className="px-2 py-4 text-center text-white/60">{message}</td>
  </tr>
);

export default KPIProspectFunnel;
