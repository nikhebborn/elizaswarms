'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAgents } from '@/hooks/use-agents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agentFormSchema, AgentFormValues } from '@/lib/utils/validators';
import { formatAgentForApi } from '@/lib/utils/helpers';

interface AgentFormProps {
  initialValues?: AgentFormValues;
  agentId?: string;
}

export function AgentForm({ initialValues, agentId }: AgentFormProps) {
  const router = useRouter();
  const { addAgent, editAgent, loading, error } = useAgents();
  
  const defaultValues: AgentFormValues = initialValues || {
    name: '',
    description: '',
    persona: 'Du bist ein hilfreicher und freundlicher Assistent.',
    goals: 'Benutzeranfragen beantworten, Hilfe anbieten',
    constraints: 'Keine persönlichen Daten teilen, Höflich bleiben',
    provider: 'gemini',
    model: 'gemini-pro',
    temperature: 0.7,
  };
  
  const { control, handleSubmit, formState: { errors } } = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: AgentFormValues) => {
    try {
      const agentData = formatAgentForApi(data);
      
      if (agentId) {
        // Update existing agent
        await editAgent(agentId, agentData);
        // Stay on the same page
      } else {
        // Create new agent
        const newAgent = await addAgent(agentData);
        if (newAgent) {
          router.push(`/agents/${newAgent.id}/manage`);
        }
      }
    } catch (err) {
      console.error(`Error ${agentId ? 'updating' : 'creating'} agent:`, err);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent-Konfiguration</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <p>Fehler: {error.message}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Grundlegende Informationen</h3>
            
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  label="Name"
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Beschreibung"
                  error={errors.description?.message}
                  rows={3}
                  {...field}
                />
              )}
            />
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Charakter</h3>
            
            <Controller
              name="persona"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Persona"
                  error={errors.persona?.message}
                  rows={3}
                  placeholder="Du bist ein hilfreicher und freundlicher Assistent."
                  {...field}
                />
              )}
            />
            
            <Controller
              name="goals"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Ziele (durch Komma getrennt)"
                  error={errors.goals?.message}
                  rows={2}
                  placeholder="Benutzeranfragen beantworten, Hilfe anbieten"
                  {...field}
                />
              )}
            />
            
            <Controller
              name="constraints"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Einschränkungen (durch Komma getrennt)"
                  error={errors.constraints?.message}
                  rows={2}
                  placeholder="Keine persönlichen Daten teilen, Höflich bleiben"
                  {...field}
                />
              )}
            />
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">LLM-Konfiguration</h3>
            
            <Controller
              name="provider"
              control={control}
              render={({ field }) => (
                <Select
                  label="Provider"
                  error={errors.provider?.message}
                  options={[
                    { value: 'gemini', label: 'Gemini (Google)' },
                  ]}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <Select
                  label="Modell"
                  error={errors.model?.message}
                  options={[
                    { value: 'gemini-pro', label: 'Gemini Pro' },
                  ]}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="temperature"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Temperature"
                  error={errors.temperature?.message}
                  min="0"
                  max="1"
                  step="0.1"
                  value={field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/agents')}
          >
            {agentId ? 'Zurück' : 'Abbrechen'}
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : agentId ? 'Änderungen speichern' : 'Agent erstellen'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
